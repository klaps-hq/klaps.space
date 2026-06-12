export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

// Public MinIO mirror populated by the scraper (single writer), e.g.
// https://media.klaps.space/<bucket>/tmdb. Baked in at build time; when
// unset (local dev) images load straight from the TMDB CDN. The frontend
// holds no mirroring logic, it only renders whichever base is configured.
const IMAGE_BASE_URL =
  process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL || TMDB_IMAGE_BASE_URL;

export type TmdbImageSize =
  | "w92"
  | "w154"
  | "w185"
  | "w300"
  | "w342"
  | "w500"
  | "w780"
  | "w1280"
  | "original";

/**
 * Absolute TMDB CDN URL. Internal building block for tmdbImageSrc and
 * resolveTmdbPhotoUrl; all rendering and SEO consumers (next/image,
 * JSON-LD, sitemap, OG images) should use tmdbImageSrc/tmdbPhotoSrc, which
 * point at the mirror when one is configured.
 */
export function tmdbImageUrl(
  path: string,
  size: TmdbImageSize = "w500"
): string {
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

/**
 * Display URL for next/image: the scraper-populated MinIO mirror when
 * configured, the TMDB CDN otherwise. Absolute TMDB URLs are rebased onto
 * the mirror (keeping their size segment); other absolute URLs pass
 * through untouched.
 */
export function tmdbImageSrc(
  path: string,
  size: TmdbImageSize = "w500"
): string {
  if (path.startsWith("http")) {
    if (!path.startsWith(`${TMDB_IMAGE_BASE_URL}/`)) return path;
    return `${IMAGE_BASE_URL}${path.slice(TMDB_IMAGE_BASE_URL.length)}`;
  }
  return `${IMAGE_BASE_URL}/${size}${path}`;
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

/**
 * Display variant of resolveTmdbPhotoUrl: same validation, but the
 * resulting URL points at the mirror when one is configured.
 */
export function tmdbPhotoSrc(
  photoUrl: string | null | undefined,
  size: TmdbImageSize = "w342"
): string | null {
  const resolved = resolveTmdbPhotoUrl(photoUrl, size);
  if (!resolved) return null;
  return tmdbImageSrc(resolved, size);
}
