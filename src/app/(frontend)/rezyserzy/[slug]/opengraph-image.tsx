import { getDirectorBySlug } from "@/lib/directors";
import { buildOgImage, OG_SIZE } from "@/lib/og-image";
import { resolveTmdbPhotoUrl } from "@/lib/tmdb";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Klaps - reżyser";

interface OgImageProps {
  params: Promise<{ slug: string }>;
}

export default async function OgImage({ params }: OgImageProps) {
  const { slug } = await params;
  const director = await getDirectorBySlug(slug);

  return buildOgImage({
    eyebrow: "Reżyser",
    title: director.name,
    subtitle: "Filmy i seanse w kinach studyjnych",
    posterUrl: resolveTmdbPhotoUrl(director.photoUrl, "w500"),
  });
}
