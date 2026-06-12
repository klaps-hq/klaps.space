import sharp from "sharp";
import { tmdbImageSrc } from "./tmdb";
import type { TmdbImageSize } from "./tmdb";

/**
 * Tiny base64 placeholders for next/image placeholder="blur". Generated
 * server-side from the smallest image variant (fetched from the same base
 * the displayed images use), so the hero shows a blurred frame instantly
 * while the full-size backdrop streams in.
 */

type BlurKind = "backdrop" | "poster";

// Smallest TMDB variant per asset type keeps the source fetch tiny.
const SOURCE_SIZE: Record<BlurKind, TmdbImageSize> = {
  backdrop: "w300",
  poster: "w92",
};

// next/image stretches and re-blurs the placeholder client-side, so a
// couple dozen pixels of detail is plenty.
const BLUR_WIDTH = 24;

// Single long-running node process (standalone), so an in-memory cache
// amortizes the sharp work across ISR revalidations. Failures are not
// cached: they are usually transient connectivity errors.
const MAX_CACHE_ENTRIES = 500;
const blurCache = new Map<string, string>();

export async function getTmdbBlurDataUrl(
  path: string | null | undefined,
  kind: BlurKind = "backdrop"
): Promise<string | null> {
  // Only plain TMDB paths ("/abc.jpg") map onto mirror keys.
  if (!path || !path.startsWith("/")) return null;

  const size = SOURCE_SIZE[kind];
  const key = `${size}${path}`;
  const cached = blurCache.get(key);
  if (cached) return cached;

  try {
    const response = await fetch(tmdbImageSrc(path, size), {
      cache: "no-store",
    });
    if (!response.ok) return null;
    const placeholder = await sharp(
      Buffer.from(await response.arrayBuffer())
    )
      .resize(BLUR_WIDTH)
      .webp({ quality: 40 })
      .toBuffer();
    const dataUrl = `data:image/webp;base64,${placeholder.toString("base64")}`;

    if (blurCache.size >= MAX_CACHE_ENTRIES) {
      // Drop the oldest entry; Map preserves insertion order.
      const oldest = blurCache.keys().next().value;
      if (oldest) blurCache.delete(oldest);
    }
    blurCache.set(key, dataUrl);
    return dataUrl;
  } catch {
    return null;
  }
}
