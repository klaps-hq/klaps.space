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

// One sub-sitemap per resource type. Shared between the generateSitemaps
// metadata route (which serves each sub-sitemap at /sitemap/[id].xml) and
// the /sitemap.xml index route handler that lists them. Next does NOT emit
// a sitemap index on its own, so the index is hand-rolled from this list.
export const SITEMAP_IDS = [
  "static",
  "filmy",
  "kina",
  "miasta",
  "gatunki",
  "rezyserzy",
  "blog",
] as const;
export type SitemapId = (typeof SITEMAP_IDS)[number];
