import { readFile } from "node:fs/promises";
import path from "node:path";
import { buildOgImage, OG_SIZE } from "@/lib/og-image";
import { SITE_URL } from "@/lib/site-config";
import { clampText } from "@/lib/seo";
import { getCover, getPostBySlug } from "@/lib/posts";
import type { Media } from "@/payload-types";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Klaps - Blog";

interface OgImageProps {
  params: Promise<{ slug: string }>;
}

// Resolve the post cover to a data URI for Satori. Local storage is read
// straight from disk (works even mid-build, before the server is up); a
// remote storage adapter falls back to an HTTP fetch. Any failure just
// drops the photo instead of failing the whole OG image.
const loadCoverPhoto = async (cover: Media | null): Promise<string | null> => {
  if (!cover) return null;

  // Prefer the pregenerated "og" size (1200x630), fall back to the original.
  const og = cover.sizes?.og;
  const filename = og?.filename || cover.filename;
  const url = og?.url || cover.url;
  const mimeType = og?.mimeType || cover.mimeType || "image/jpeg";

  if (filename) {
    try {
      const file = await readFile(
        path.join(process.cwd(), "public/media", filename)
      );
      return `data:${mimeType};base64,${file.toString("base64")}`;
    } catch {
      // Not on local disk, try HTTP below.
    }
  }

  if (!url) return null;
  try {
    const res = await fetch(url.startsWith("http") ? url : `${SITE_URL}${url}`);
    if (!res.ok) return null;
    const buffer = Buffer.from(await res.arrayBuffer());
    return `data:${mimeType};base64,${buffer.toString("base64")}`;
  } catch {
    return null;
  }
};

export default async function OgImage({ params }: OgImageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug).catch(() => null);
  const photoUrl = post ? await loadCoverPhoto(getCover(post)) : null;

  return buildOgImage({
    eyebrow: "Blog",
    title: post ? clampText(post.title, 70) : "Blog",
    subtitle: post ? clampText(post.excerpt, 120) : undefined,
    photoUrl,
  });
}
