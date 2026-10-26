import type { ImageLoader } from "next/image";

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

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
function tmdbImageUrl(path: string, size: TmdbImageSize = "w500"): string {
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
 * TMDB CDN URL to retry with when the mirror fails to serve an image. The
 * scraper only mirrors newly added movies, so files can be missing from the
 * bucket; rather than dropping to a placeholder, renderers fall back to the
 * origin. Returns null when no mirror is configured (the display URL already
 * points at the CDN, so a retry would refetch the same broken source) or
 * when the value is a non-TMDB absolute URL.
 */
export function tmdbCdnFallbackSrc(
  path: string,
  size: TmdbImageSize = "w500"
): string | null {
  if (IMAGE_BASE_URL === TMDB_IMAGE_BASE_URL) return null;
  if (path.startsWith("http")) {
    return path.startsWith(`${TMDB_IMAGE_BASE_URL}/`) ? path : null;
  }
  return tmdbImageUrl(path, size);
}

// Optimizer widths up to this value are resized from the w1280 backdrop
// instead of the original: decoding a 4K original on a cold optimizer cache
// costs over a second of hero TTFB, a 1280px source a fraction of that.
// Only wider viewports pay for the original, where w1280 would look soft.
const BACKDROP_W1280_MAX_WIDTH = 1280;

// Bare TMDB path ("/abc.jpg") from a stored backdrop value; absolute TMDB
// URLs drop their base and size segment. Anything else passes through.
const toTmdbPath = (value: string): string => {
  if (!value.startsWith(`${TMDB_IMAGE_BASE_URL}/`)) return value;
  const rest = value.slice(TMDB_IMAGE_BASE_URL.length + 1);
  const slash = rest.indexOf("/");
  return slash > 0 ? rest.slice(slash) : value;
};

/**
 * next/image loader for full-bleed TMDB backdrops: picks the w1280 or the
 * original file as the optimizer source depending on the requested width
 * (see BACKDROP_W1280_MAX_WIDTH). With `cdn` set it targets the TMDB CDN
 * instead of the mirror, for the retry after a mirror miss.
 */
export const tmdbBackdropLoader =
  (backdropUrl: string, cdn = false): ImageLoader =>
  ({ width, quality }) => {
    const path = toTmdbPath(backdropUrl);
    const size: TmdbImageSize =
      width <= BACKDROP_W1280_MAX_WIDTH ? "w1280" : "original";
    const src =
      (cdn ? tmdbCdnFallbackSrc(path, size) : null) ?? tmdbImageSrc(path, size);
    return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality ?? 75}`;
  };

/**
 * Resolve a person/poster image into a usable absolute URL.
 * Directors come from TMDB, so photoUrl is normally a profile path
 * ("/abc.jpg"). next/image only whitelists image.tmdb.org, so values from
 * any other host return null and the caller falls back to a placeholder.
 */
function resolveTmdbPhotoUrl(
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

/** tmdbCdnFallbackSrc for person photos: same validation, CDN target. */
export function tmdbPhotoCdnFallbackSrc(
  photoUrl: string | null | undefined,
  size: TmdbImageSize = "w342"
): string | null {
  const resolved = resolveTmdbPhotoUrl(photoUrl, size);
  if (!resolved) return null;
  return tmdbCdnFallbackSrc(resolved, size);
}
