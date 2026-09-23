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
import { getMoviePosterMap } from "@/lib/movies";
import { getPostsPage, getPublishedPosts } from "@/lib/posts";
import type { Post } from "@/payload-types";
import { ISitemapEntry } from "@/interfaces/ISitemap";

/**
 * Five minutes, matching the listing pages rather than the hour a sitemap
 * would otherwise deserve.
 *
 * `next build` runs without a Payload secret, so the blog sub-sitemap is
 * always prerendered empty and shipped that way inside the image. The
 * repertoire-backed types do not share the problem, because they read one
 * `/sitemap` endpoint that the build can reach. At an hour, every release
 * therefore served /sitemap/blog.xml with zero URLs until the first
 * revalidation - and on a day with several deploys that is most of the day.
 *
 * Regenerating is cheap here (one upstream call plus the Payload read) and
 * crawlers fetch these a handful of times a day, so the shorter window
 * costs little and bounds the empty period to five minutes.
 */
export const revalidate = 300;

const sanitizeSlug = (slug: string | null | undefined) => slug?.trim() ?? "";
const isValidSlug = (slug: string) =>
  slug.length > 0 && !slug.includes("/") && !slug.includes("?") && !slug.includes("#");

/**
 * Date of the last deploy that changed what these templates render.
 *
 * `updatedAt` from the API tracks when a cinema's or city's *data* changed,
 * which is the right signal most of the time. It is the wrong one after a
 * template change: the September 2026 release moved the repertoire into the
 * server HTML on ~900 pages, so their content genuinely changed while their
 * API timestamps still read June. Left alone, the only freshness signal
 * Google reads when fetching the sitemap says nothing happened.
 *
 * Bump this ONLY when a release changes what the listing templates output,
 * and never to a future date. Pages whose data is newer keep their own
 * timestamp, so this raises a floor rather than flattening every entry onto
 * one date, which is the pattern that gets a sitemap distrusted.
 *
 * Keyed by route prefix, because a release rarely touches every template:
 * bumping one shared date would claim a change on pages that did not get
 * one. `default` covers every prefix without its own entry.
 */
const TEMPLATE_CHANGED_AT: Record<string, Date> = {
  default: new Date("2026-09-13T00:00:00.000Z"),
  // "Ostatnio w repertuarze" added the venue's recent programme to every
  // cinema and city page, most of which had no upcoming screenings to show.
  kina: new Date("2026-09-23T00:00:00.000Z"),
  miasta: new Date("2026-09-23T00:00:00.000Z"),
};

const templateFloorFor = (basePath: string): Date =>
  TEMPLATE_CHANGED_AT[basePath] ?? TEMPLATE_CHANGED_AT.default;

// Omit lastModified entirely when the API didn't send a parsable date -
// an inaccurate value is worse for crawlers than none at all.
const toLastModified = (
  updatedAt: string | null | undefined
): Date | undefined => {
  if (!updatedAt) return undefined;
  const date = new Date(updatedAt);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

// Raises an entry's date to the template floor without ever lowering it or
// inventing one where the API gave none.
const withTemplateFloor = (
  date: Date | undefined,
  floor: Date
): Date | undefined => (date && date < floor ? floor : date);

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
      lastModified: withTemplateFloor(
        toLastModified(entry.updatedAt),
        templateFloorFor(basePath)
      ),
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

// Genre pages with no upcoming screenings are noindex - same conflict guard.
//
// The count has to come from the screenings feed, not the movie catalogue:
// a genre page renders screenings and nothing else, so a genre whose films
// exist only in the catalogue still renders an empty page. Counting
// catalogue entries let /gatunki/western - zero screenings, 151 words of
// boilerplate - into both the index and the sitemap.
//
// One screenings call covers every genre, since each group carries its
// movie's genres. An empty feed means a backend hiccup, not zero screenings
// nationwide, so keep the full list then instead of emptying the sitemap.
const filterGenresWithScreenings = async (
  genres: ISitemapEntry[]
): Promise<ISitemapEntry[]> => {
  try {
    const groups = await getScreenings();
    if (groups.length === 0) return genres;
    const slugsWithScreenings = new Set(
      groups.flatMap((group) => group.movie.genres.map((genre) => genre.slug))
    );
    return genres.filter((genre) => slugsWithScreenings.has(genre.slug));
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

// `next build` runs without a database or a Payload secret, so every fetch
// in here fails and the prerendered sitemap ships empty; ISR fills it in on
// the first revalidation. That is expected and has to stay tolerated, or
// the build cannot complete at all.
const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";

/**
 * Swallows a failed fetch during the build only, and rethrows at runtime.
 *
 * Catching it everywhere turned a failure into a *successful* empty
 * sub-sitemap, which Next then cached for the full hour of `revalidate`.
 * The database is briefly unreachable right after a deploy, which is
 * exactly when the regeneration runs, so for an hour after every release
 * /sitemap/blog.xml told Google the blog had no URLs at all. Rethrowing
 * makes Next keep serving the last good copy instead.
 */
const emptyDuringBuild = <T>(error: unknown): T[] => {
  if (isBuildPhase) return [];
  throw error;
};

// Blog posts come from Payload, not the repertoire API, which is why they
// need the guard above; an empty array still ships when the fetch succeeds
// and there genuinely are no published posts.
const buildBlogPages = async (): Promise<MetadataRoute.Sitemap> => {
  const postPages: MetadataRoute.Sitemap = (
    await getPublishedPosts().catch(emptyDuringBuild<Post>)
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
  // Same build-only tolerance as the posts fetch above.
  const archivePages: MetadataRoute.Sitemap = await getPostsPage(1)
    .then(({ totalPages }) =>
      Array.from({ length: Math.max(totalPages - 1, 0) }, (_, index) => ({
        url: `${SITE_URL}/blog/strona/${index + 2}`,
        changeFrequency: "weekly" as const,
        priority: 0.4,
      }))
    )
    .catch(emptyDuringBuild<MetadataRoute.Sitemap[number]>);

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
      const genres = await filterGenresWithScreenings(entries.genres);
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
