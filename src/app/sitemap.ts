import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-config";
// Note: the helper lives in sitemap-entries.ts because a file named
// sitemap.ts anywhere under app/ would register as a metadata route.
import {
  getSitemapEntries,
  SITEMAP_IDS,
  type SitemapId,
} from "@/lib/sitemap-entries";
import { getScreenings } from "@/lib/screenings";
import { getMovies, getMoviePosterMap } from "@/lib/movies";
import { getGenres } from "@/lib/genres";
import { getPostsPage, getPublishedPosts } from "@/lib/posts";
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
  priority: number,
  // Optional per-slug image resolver: returns an absolute image URL to attach
  // as a sitemap <image:image> entry, or undefined when the slug has none.
  imageFor?: (slug: string) => string | undefined
): MetadataRoute.Sitemap =>
  entries
    .map((entry) => ({
      slug: sanitizeSlug(entry.slug),
      lastModified: toLastModified(entry.updatedAt),
    }))
    .filter(({ slug }) => isValidSlug(slug))
    .map(({ slug, lastModified }) => {
      const image = imageFor?.(slug);
      return {
        url: `${SITE_URL}/${basePath}/${encodeURIComponent(slug)}`,
        lastModified,
        changeFrequency,
        priority,
        ...(image ? { images: [image] } : {}),
      };
    });

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

// A slug collision would otherwise emit the same <url> twice within a
// sub-sitemap; keep the last occurrence.
const dedupeByUrl = (pages: MetadataRoute.Sitemap): MetadataRoute.Sitemap =>
  Array.from(new Map(pages.map((item) => [item.url, item])).values());

const staticPages: MetadataRoute.Sitemap = [
  { url: SITE_URL, changeFrequency: "daily", priority: 1 },
  { url: `${SITE_URL}/seanse`, changeFrequency: "daily", priority: 0.9 },
  { url: `${SITE_URL}/kina`, changeFrequency: "weekly", priority: 0.8 },
  { url: `${SITE_URL}/mapa-kin`, changeFrequency: "weekly", priority: 0.7 },
  { url: `${SITE_URL}/miasta`, changeFrequency: "weekly", priority: 0.7 },
  { url: `${SITE_URL}/gatunki`, changeFrequency: "weekly", priority: 0.7 },
  { url: `${SITE_URL}/rezyserzy`, changeFrequency: "weekly", priority: 0.6 },
  { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.6 },
  { url: `${SITE_URL}/mapa-witryny`, changeFrequency: "monthly", priority: 0.3 },
  { url: `${SITE_URL}/o-projekcie`, changeFrequency: "monthly", priority: 0.3 },
  { url: `${SITE_URL}/kontakt`, changeFrequency: "monthly", priority: 0.3 },
  { url: `${SITE_URL}/faq`, changeFrequency: "monthly", priority: 0.3 },
  { url: `${SITE_URL}/regulamin`, changeFrequency: "monthly", priority: 0.2 },
  { url: `${SITE_URL}/polityka-prywatnosci`, changeFrequency: "monthly", priority: 0.2 },
];

// Blog posts come from Payload, not the repertoire API, so they get their
// own resilience: on a database hiccup the sub-sitemap just ships empty.
const buildBlogPages = async (): Promise<MetadataRoute.Sitemap> => {
  const postPages: MetadataRoute.Sitemap = (
    await getPublishedPosts().catch(() => [])
  ).flatMap((post) =>
    post.slug
      ? [
          {
            url: `${SITE_URL}/blog/${post.slug}`,
            lastModified: toLastModified(post.updatedAt),
            changeFrequency: "monthly" as const,
            priority: 0.6,
          },
        ]
      : []
  );

  // Paginated blog archive (/blog/strona/2..N); page 1 is /blog itself.
  const archivePages: MetadataRoute.Sitemap = await getPostsPage(1)
    .then(({ totalPages }) =>
      Array.from({ length: Math.max(totalPages - 1, 0) }, (_, index) => ({
        url: `${SITE_URL}/blog/strona/${index + 2}`,
        changeFrequency: "weekly" as const,
        priority: 0.4,
      }))
    )
    .catch(() => []);

  return [...postPages, ...archivePages];
};

// One sub-sitemap per resource type (SITEMAP_IDS lives in the shared lib so
// the /sitemap.xml index route can list the same set). Next serves each
// sub-sitemap at /sitemap/[id].xml but does NOT generate the index itself;
// that is hand-rolled in app/sitemap.xml/route.ts. See KLA-7.
export async function generateSitemaps(): Promise<{ id: SitemapId }[]> {
  return SITEMAP_IDS.map((id) => ({ id }));
}

// As of Next 16 the id is passed as a Promise that resolves to a string.
const sitemap = async ({
  id,
}: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> => {
  const sitemapId = (await id) as SitemapId;

  if (sitemapId === "static") {
    return staticPages;
  }

  if (sitemapId === "blog") {
    return dedupeByUrl(await buildBlogPages());
  }

  // The repertoire-backed types share one upstream call. On failure each
  // sub-sitemap ships empty rather than 500ing the whole index; the static
  // and blog sub-sitemaps stay unaffected because they don't reach here.
  let entries;
  try {
    entries = await getSitemapEntries();
  } catch (error) {
    console.error(
      `Sitemap[${sitemapId}]: failed to fetch /sitemap from API:`,
      error
    );
    return [];
  }

  switch (sitemapId) {
    case "filmy": {
      // Cross-checked against the screenings feed (noindex guard); poster
      // URLs ride along as <image:image>. On a poster-map failure movie
      // entries simply ship without an image.
      const [movies, posters] = await Promise.all([
        filterMoviesWithScreenings(entries.movies),
        getMoviePosterMap().catch(() => new Map<string, string>()),
      ]);
      return dedupeByUrl(
        toPages(movies, "filmy", "daily", 0.7, (slug) => posters.get(slug))
      );
    }
    case "kina":
      // Cinemas arrive pre-filtered by the API.
      return dedupeByUrl(toPages(entries.cinemas, "kina", "daily", 0.6));
    case "miasta":
      // Cities arrive pre-filtered by the API (only those with cinemas).
      return dedupeByUrl(toPages(entries.cities, "miasta", "daily", 0.6));
    case "gatunki": {
      const genres = await filterNonEmptyGenres(entries.genres);
      return dedupeByUrl(toPages(genres, "gatunki", "weekly", 0.5));
    }
    case "rezyserzy":
      // Directors arrive pre-filtered by the API (only those above the
      // indexing threshold), so no noindex cross-check is needed here.
      return dedupeByUrl(
        toPages(entries.directors ?? [], "rezyserzy", "weekly", 0.5)
      );
    default:
      return [];
  }
};

export default sitemap;
