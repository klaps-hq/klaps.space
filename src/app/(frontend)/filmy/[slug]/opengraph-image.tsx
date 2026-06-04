import { getMovieBySlug } from "@/lib/movies";
import { tmdbImageUrl } from "@/lib/tmdb";
import { formatDuration, formatNames } from "@/lib/utils";
import { buildOgImage, OG_SIZE } from "@/lib/og-image";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Klaps - seanse filmu w kinach studyjnych";

interface OgImageProps {
  params: Promise<{ slug: string }>;
}

export default async function OgImage({ params }: OgImageProps) {
  const { slug } = await params;
  const movie = await getMovieBySlug(slug);

  const directors = formatNames(movie.directors);
  const subtitle = [
    movie.productionYear?.toString(),
    movie.duration ? formatDuration(movie.duration) : null,
    directors ? `reż. ${directors}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return buildOgImage({
    eyebrow: "Seanse w kinach",
    title: movie.title,
    subtitle,
    posterUrl: movie.posterUrl ? tmdbImageUrl(movie.posterUrl, "w780") : null,
  });
}
