import { getGenreBySlug } from "@/lib/genres";
import { buildOgImage, OG_SIZE } from "@/lib/og-image";
import { getGenreForms } from "@/lib/genre-guides";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Klaps - seanse z gatunku";

interface OgImageProps {
  params: Promise<{ slug: string }>;
}

export default async function OgImage({ params }: OgImageProps) {
  const { slug } = await params;
  const genre = await getGenreBySlug(slug);
  const forms = getGenreForms(genre.slug, genre.name);

  return buildOgImage({
    eyebrow: "Seanse z gatunku",
    title: forms.plural,
    subtitle: `Seanse ${forms.genitive} w kinach`,
  });
}
