import { cache } from "react";
import { apiFetch } from "./client";
import { getScreenings } from "./screenings";
import { ISitemapResponse } from "@/interfaces/ISitemap";
import { MERGED_CINEMA_SLUGS, MERGED_CITY_SLUGS } from "./merged-slugs";
import { isChainCinema } from "./cinema-chains";

// Slugs are the slugified venue name ("cinema-city-bonarka"), so the chain
// patterns match them once the hyphens are spaces again.
const isChainSlug = (slug: string): boolean =>
  isChainCinema(slug.replace(/-/g, " "));

/**
 * Lightweight payload for sitemap.xml: slugs + updatedAt for every
 * indexable resource in a single request.
 */
export const getSitemapEntries = async (): Promise<ISitemapResponse> => {
  const entries = await apiFetch<ISitemapResponse>("sitemap", {
    next: { revalidate: 3600 },
  });
  // Merged duplicates 301 to their canonical page, so they are neither
  // advertised in the sitemap nor linked from the hubs. Chain venues are
  // noindex on the page itself, so they are dropped here too, even while an
  // older API still lists them (content audit #4).
  return {
    ...entries,
    cinemas: entries.cinemas.filter(
      (entry) => !(entry.slug in MERGED_CINEMA_SLUGS) && !isChainSlug(entry.slug)
    ),
    cities: entries.cities.filter(
      (entry) => !(entry.slug in MERGED_CITY_SLUGS)
    ),
  };
};

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
  // Long-tail landing pages: /kino-plenerowe, /klasyka-w-kinach, /swieta-w-kinie.
  "tematy",
] as const;
export type SitemapId = (typeof SITEMAP_IDS)[number];

export interface IndexableSlugs {
  cinemas: ReadonlySet<string>;
  cities: ReadonlySet<string>;
  /**
   * Movies with an upcoming or recent screening in an independent cinema,
   * the film sitemap's list and the rule movie pages apply for noindex
   * (isMovieIndexable). null when the API sent an empty list.
   */
  movies: ReadonlySet<string> | null;
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
 * Slugs whose pages are indexable, i.e. the ones the API
 * advertises in the sitemap (the pages apply the same rules for noindex).
 * Hubs link only these: /kina and /miasta used to link ~450 noindex pages,
 * which Google kept crawling instead of the ones with content.
 *
 * null when the API call fails - callers then link everything, since a
 * missing link costs more than a crawl of a noindex page.
 *
 * Request-memoized: a listing reads it in both the filter island and the
 * card grid, and toRepertoire relies on getting the same Set back.
 */
export const getIndexableSlugs = cache(async (): Promise<IndexableSlugs | null> => {
  try {
    const [entries, groups] = await Promise.all([
      getSitemapEntries(),
      getScreenings(),
    ]);
    return {
      cinemas: new Set(entries.cinemas.map((entry) => entry.slug)),
      cities: new Set(entries.cities.map((entry) => entry.slug)),
      // An empty list is a backend hiccup, not a nationwide blank: link all.
      movies:
        entries.movies.length > 0
          ? new Set(entries.movies.map((entry) => entry.slug))
          : null,
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
});
