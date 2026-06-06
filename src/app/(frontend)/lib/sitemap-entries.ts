import { apiFetch } from "./client";
import { ISitemapResponse } from "@/interfaces/ISitemap";

/**
 * Lightweight payload for sitemap.xml: slugs + updatedAt for every
 * indexable resource in a single request.
 */
export const getSitemapEntries = (): Promise<ISitemapResponse> =>
  apiFetch<ISitemapResponse>("sitemap", {
    next: { revalidate: 3600 },
  });
