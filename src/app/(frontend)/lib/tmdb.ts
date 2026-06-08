export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

type TmdbImageSize = "w185" | "w342" | "w500" | "w780" | "w1280" | "original";

export function tmdbImageUrl(
  path: string,
  size: TmdbImageSize = "w500"
): string {
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

/**
 * Resolve a person/poster image into a usable absolute URL.
 * Directors come from TMDB, so photoUrl is normally a profile path
 * ("/abc.jpg"). next/image only whitelists image.tmdb.org, so values from
 * any other host return null and the caller falls back to a placeholder.
 */
export function resolveTmdbPhotoUrl(
  photoUrl: string | null | undefined,
  size: TmdbImageSize = "w342"
): string | null {
  if (!photoUrl) return null;
  if (photoUrl.startsWith("/")) return tmdbImageUrl(photoUrl, size);
  if (photoUrl.includes("image.tmdb.org")) return photoUrl;
  return null;
}
