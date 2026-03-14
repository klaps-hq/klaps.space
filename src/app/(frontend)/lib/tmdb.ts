export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

type TmdbImageSize = "w185" | "w342" | "w500" | "w780" | "w1280" | "original";

export function tmdbImageUrl(
  path: string,
  size: TmdbImageSize = "w500"
): string {
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}
