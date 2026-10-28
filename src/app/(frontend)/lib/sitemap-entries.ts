import { apiFetch } from "./client";
import { getScreenings } from "./screenings";
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
  // Long-tail landing pages: /kino-plenerowe, /klasyka-w-kinach.
  "tematy",
] as const;
export type SitemapId = (typeof SITEMAP_IDS)[number];

export interface IndexableSlugs {
  cinemas: ReadonlySet<string>;
  cities: ReadonlySet<string>;
  /** Directors at or above the indexing threshold (the API filters them). */
  directors: ReadonlySet<string>;
  /**
   * Genres with upcoming screenings, the same rule as the genre page's
   * noindex and the gatunki sub-sitemap. null when the screenings feed is
   * empty or failed: an empty feed is a backend hiccup, not a nationwide
   * blank, so callers then link every genre.
   */
  genres: ReadonlySet<string> | null;
}

/**
 * Cinema and city slugs whose pages are indexable, i.e. the ones the API
 * advertises in the sitemap (the pages apply the same rules for noindex).
 * Hubs link only these: /kina and /miasta used to link ~450 noindex pages,
 * which Google kept crawling instead of the ones with content.
 *
 * null when the API call fails - callers then link everything, since a
 * missing link costs more than a crawl of a noindex page.
 */
export const getIndexableSlugs = async (): Promise<IndexableSlugs | null> => {
  try {
    const [entries, groups] = await Promise.all([
      getSitemapEntries(),
      getScreenings(),
    ]);
    return {
      cinemas: new Set(entries.cinemas.map((entry) => entry.slug)),
      cities: new Set(entries.cities.map((entry) => entry.slug)),
      directors: new Set((entries.directors ?? []).map((entry) => entry.slug)),
      genres:
        groups.length > 0
          ? new Set(
              groups.flatMap((group) =>
                group.movie.genres.map((genre) => genre.slug)
              )
            )
          : null,
    };
  } catch {
    return null;
  }
};
