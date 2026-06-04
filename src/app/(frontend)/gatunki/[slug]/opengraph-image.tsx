import { getGenreBySlug } from "@/lib/genres";
import { buildOgImage, OG_SIZE } from "@/lib/og-image";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Klaps - seanse z gatunku";

interface OgImageProps {
  params: Promise<{ slug: string }>;
}

export default async function OgImage({ params }: OgImageProps) {
  const { slug } = await params;
  const genre = await getGenreBySlug(slug);

  return buildOgImage({
    eyebrow: "Gatunek",
    title: genre.name,
    subtitle: `Seanse z gatunku ${genre.name.toLowerCase()} w kinach studyjnych`,
  });
}
