import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-config";
// Note: the helper lives in sitemap-entries.ts because a file named
// sitemap.ts anywhere under app/ would register as a metadata route.
import { getSitemapEntries } from "@/lib/sitemap-entries";
import { getScreenings } from "@/lib/screenings";
import { getMovies } from "@/lib/movies";
import { getGenres } from "@/lib/genres";
import { ISitemapEntry } from "@/interfaces/ISitemap";

export const revalidate = 3600;

const sanitizeSlug = (slug: string | null | undefined) => slug?.trim() ?? "";
const isValidSlug = (slug: string) =>
  slug.length > 0 && !slug.includes("/") && !slug.includes("?") && !slug.includes("#");

// Omit lastModified entirely when the API didn't send a parsable date -
// an inaccurate value is worse for crawlers than none at all.
const toLastModified = (
  updatedAt: string | null | undefined
): Date | undefined => {
  if (!updatedAt) return undefined;
  const date = new Date(updatedAt);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

const toPages = (
  entries: ISitemapEntry[],
  basePath: string,
  changeFrequency: "daily" | "weekly",
  priority: number
): MetadataRoute.Sitemap =>
  entries
    .map((entry) => ({
      slug: sanitizeSlug(entry.slug),
      lastModified: toLastModified(entry.updatedAt),
    }))
    .filter(({ slug }) => isValidSlug(slug))
    .map(({ slug, lastModified }) => ({
      url: `${SITE_URL}/${basePath}/${encodeURIComponent(slug)}`,
      lastModified,
      changeFrequency,
      priority,
    }));

// Movie pages without upcoming screenings render with a noindex meta;
// submitting them would conflict with that signal ("Submitted URL marked
// noindex" in Search Console). Cross-check against the screenings feed.
// An empty feed means a backend hiccup, not zero screenings nationwide -
// keep the full list then instead of emptying the sitemap.
const filterMoviesWithScreenings = async (
  movies: ISitemapEntry[]
): Promise<ISitemapEntry[]> => {
  try {
    const groups = await getScreenings();
    if (groups.length === 0) return movies;
    const slugsWithScreenings = new Set(groups.map((g) => g.movie.slug));
    return movies.filter((m) => slugsWithScreenings.has(m.slug));
  } catch {
    return movies;
  }
};

// Genre pages with zero movies are noindex - same conflict guard. When
// every count comes back zero, assume the movies API is down and keep
// the full list.
const filterNonEmptyGenres = async (
  genres: ISitemapEntry[]
): Promise<ISitemapEntry[]> => {
  try {
    const apiGenres = await getGenres();
    const counts = await Promise.all(
      apiGenres.map(async (genre) => {
        const { meta } = await getMovies({
          genreId: genre.id.toString(),
          limit: 1,
        });
        return [genre.slug, meta.total] as const;
      })
    );
    if (counts.every(([, total]) => total === 0)) return genres;
    const nonEmptySlugs = new Set(
      counts.filter(([, total]) => total > 0).map(([slug]) => slug)
    );
    return genres.filter((g) => nonEmptySlugs.has(g.slug));
  } catch {
    return genres;
  }
};

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/seanse`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/kina`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/mapa-kin`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/miasta`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/gatunki`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/o-projekcie`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/kontakt`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/faq`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/regulamin`, changeFrequency: "monthly", priority: 0.2 },
    { url: `${SITE_URL}/polityka-prywatnosci`, changeFrequency: "monthly", priority: 0.2 },
  ];

  // One request covers every dynamic resource. On failure serve the static
  // pages only - an incomplete sitemap beats a 500, but log it loudly.
  let entries;
  try {
    entries = await getSitemapEntries();
  } catch (error) {
    console.error("Sitemap: failed to fetch /sitemap from API:", error);
    return staticPages;
  }

  // Cities arrive pre-filtered by the API (only those with cinemas);
  // movies and genres are cross-checked here against their noindex rules.
  const [movies, genres] = await Promise.all([
    filterMoviesWithScreenings(entries.movies),
    filterNonEmptyGenres(entries.genres),
  ]);

  const allPages = [
    ...staticPages,
    ...toPages(movies, "filmy", "daily", 0.7),
    ...toPages(entries.cinemas, "kina", "daily", 0.6),
    ...toPages(entries.cities, "miasta", "daily", 0.6),
    ...toPages(genres, "gatunki", "weekly", 0.5),
  ];

  return Array.from(new Map(allPages.map((item) => [item.url, item])).values());
};

export default sitemap;
