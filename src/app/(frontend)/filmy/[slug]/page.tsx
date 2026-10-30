import { Metadata } from "next";
import { getMoviePageData, getMovieBySlug } from "@/lib/movies";
import {
  getMovieScreenings,
  getRecentVenues,
  getScreenings,
} from "@/lib/screenings";
import { getIndexableSlugs } from "@/lib/sitemap-entries";
import { SITE_URL } from "@/lib/site-config";
import {
  BASE_OPEN_GRAPH,
  NOINDEX_FOLLOW,
  clampText,
  pluralPl,
} from "@/lib/seo";

// Google truncates snippets past roughly this length.
const MAX_DESCRIPTION_LENGTH = 160;
import Footer from "@/app/(home)/_components/footer";
import SiteHeader from "@/components/common/site-header";
import NextScreening from "@/components/common/next-screening";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import MovieHero from "./_components/movie-hero";
import MovieAbout from "./_components/movie-about";
import MovieScreenings from "./_components/movie-screenings";
import MovieScreeningCities, {
  buildMovieScreeningContext,
} from "./_components/movie-screening-cities";
import MovieRecentVenues from "./_components/movie-recent-venues";
import RelatedMovies from "./_components/related-movies";
import { movieNextScreeningItems } from "@/lib/next-screening-items";
import { pickRelatedMovies } from "@/lib/related-movies";
import { getProgrammeProfile } from "@/lib/programme-profile";
import ProgrammeProfile from "@/components/common/programme-profile";

// ISR: cached HTML revalidated every 5 minutes. Reading cookies or
// searchParams here would force per-request rendering - the preferred-city
// filter lives client-side in MovieScreenings instead.
export const revalidate = 300;

interface MoviePageProps {
  params: Promise<{ slug: string }>;
}

// Prebuild the indexable movie pages (those with upcoming screenings)
// so bots never hit a cold render. Movies without screenings still
// render on demand (dynamicParams defaults to true).
export const generateStaticParams = async (): Promise<{ slug: string }[]> => {
  try {
    const groups = await getScreenings();
    return groups.map((group) => ({ slug: group.movie.slug }));
  } catch {
    return [];
  }
};

export const generateMetadata = async ({
  params,
}: MoviePageProps): Promise<Metadata> => {
  const { slug } = await params;
  const movie = await getMovieBySlug(slug);

  // null means the call failed, which must never read as "no screenings"
  // (that would noindex the page for the ISR window).
  const upcoming = await getMovieScreenings({
    movieId: movie.id.toString(),
  }).catch(() => null);
  const screenings = upcoming ?? [];
  const screeningsCount = screenings.length;
  // Only needed between screening runs; [] on failure keeps the old rule.
  const recentVenues =
    upcoming?.length === 0 ? await getRecentVenues(movie.id) : [];

  const genreNames = movie.genres.map((g) => g.name).join(", ");
  const directorNames = movie.directors?.map((d) => d.name).join(", ");
  // Top-billed cast keeps description-less movies from sharing one
  // near-identical fallback snippet.
  const actorNames = movie.actors
    ?.slice(0, 2)
    .map((a) => a.name)
    .join(", ");

  // Real screening counts and city names in the description improve SERP
  // CTR and uniqueness. Cities stay in the nominative inside parentheses
  // (no preposition, so no declension needed).
  const cityNames = [
    ...new Set(screenings.map((s) => s.cinema.city.name)),
  ].slice(0, 2);
  const citiesPart = cityNames.length > 0 ? ` (m.in. ${cityNames.join(", ")})` : "";
  const recentCities = [
    ...new Set(recentVenues.map((v) => v.cinema.city.name)),
  ].slice(0, 2);
  const recentSuffix = `Ostatnio w ${recentVenues.length} ${pluralPl(recentVenues.length, "kinie", "kinach", "kinach")} (m.in. ${recentCities.join(", ")}). Sprawdź, kiedy wróci.`;
  const screeningsSuffix =
    screeningsCount > 0
      ? `Sprawdź ${screeningsCount} ${pluralPl(screeningsCount, "seans", "seanse", "seansów")} w kinach${citiesPart} - daty i godziny.`
      : recentVenues.length > 0
        ? recentSuffix
        : "Sprawdź, gdzie i kiedy grają ten film w kinach.";

  const metaLine = [
    genreNames,
    directorNames && `reż. ${directorNames}`,
    actorNames && `wyst. ${actorNames}`,
  ]
    .filter(Boolean)
    .join(", ");
  const fallbackDescription = `${movie.title} (${movie.productionYear})${metaLine ? ` - ${metaLine}` : ""}. ${screeningsSuffix}`;

  // Budget the excerpt against the suffix instead of a fixed 120 chars:
  // the suffix carries the unique part (counts, cities), so it is the half
  // worth keeping whole, and the pair has to land under the SERP snippet
  // limit or Google truncates it mid-sentence.
  const excerptBudget = MAX_DESCRIPTION_LENGTH - screeningsSuffix.length - 1;
  const excerpt =
    movie.description && excerptBudget > 40
      ? clampText(movie.description, excerptBudget)
      : null;

  const description = clampText(
    excerpt ? `${excerpt} ${screeningsSuffix}` : fallbackDescription,
    MAX_DESCRIPTION_LENGTH
  );

  // "gdzie i kiedy" mirrors the dominant query pattern for film titles
  // ("[tytuł] kiedy w kinie"), which is what this page actually answers.
  const title = `${movie.title} (${movie.productionYear}) - seanse: gdzie i kiedy w kinie`;
  const url = `${SITE_URL}/filmy/${movie.slug}`;

  // Movies with neither upcoming nor recent screenings are thin TMDB
  // duplicates - keep them out of the index until they have showtimes
  // again. Recent ones stay indexed: classics play in runs, and dropping
  // the page between runs made it fall out of the index and come back
  // (the "Ostatnio w kinach" list is their page-specific content). Same
  // 90-day window as cinema and city pages. Query-param duplicates are
  // handled by the canonical URL alone.
  const noindex = upcoming?.length === 0 && recentVenues.length === 0;

  return {
    title,
    description,
    // Self-canonical on noindex pages too, instead of inheriting a parent's.
    alternates: { canonical: url },
    ...(noindex ? NOINDEX_FOLLOW : {}),
    openGraph: {
      ...BASE_OPEN_GRAPH,
      type: "video.movie",
      url,
      title: `${movie.title} - seanse w kinach`,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${movie.title} - seanse w kinach`,
      description,
    },
  };
};

const MoviePage = async ({ params }: MoviePageProps) => {
  const { slug } = await params;
  const { movie, screenings } = await getMoviePageData(slug);
  const [recentVenues, indexable] =
    screenings.length === 0
      ? await Promise.all([getRecentVenues(movie.id), getIndexableSlugs()])
      : [[], null];
  // Screening history of this film across Polish cinemas: data no catalogue
  // site has, so it is the film page's own content next to the TMDB facts.
  const [profile, profileIndexable] = await Promise.all([
    getProgrammeProfile({ movieSlug: movie.slug }),
    indexable ?? getIndexableSlugs(),
  ]);
  // Instant blurred preview baked into the cached HTML while the full-size
  // backdrop streams in; precomputed by the scraper, served by the API.
  const backdropBlurDataUrl = movie.backdropBlurDataUrl ?? null;

  // Internal linking: up to 6 similar movies, taken from the screenings feed
  // rather than the catalogue. Catalogue picks were mostly movies without
  // screenings, i.e. noindex pages, so this block fed crawlers an endless
  // chain of pages Google will not index. Movies that are screening are the
  // indexable ones, and the more useful pick. See pickRelatedMovies for how
  // they are ranked.
  const relatedMovies =
    movie.genres.length > 0
      ? pickRelatedMovies(
          movie,
          new Set(screenings.map((s) => s.cinema.city.name)),
          await getScreenings()
        )
      : [];

  return (
    <main className="bg-black min-h-screen text-white">
      <SiteHeader />

      <div className="-mt-20">
        <MovieHero movie={movie} backdropBlurDataUrl={backdropBlurDataUrl} />
      </div>

      <div className="px-6 md:px-12 lg:px-16 py-5 md:py-6">
        <Breadcrumbs
          items={[
            { name: "Seanse", href: "/seanse" },
            { name: movie.title, href: `/filmy/${movie.slug}` },
          ]}
        />
      </div>

      {/* The id anchors #seanse deep links from shared screenings. */}
      <section
        id="seanse"
        className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-12 md:pt-16 pb-14 md:pb-20 scroll-mt-20"
      >
        {screenings.length === 0 ? (
          <MovieScreenings
            screenings={screenings}
            movieTitle={movie.title}
            movieSlug={movie.slug}
            movieDuration={movie.duration}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 gap-x-8 lg:gap-x-12">
            <div className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start flex flex-col gap-8 md:gap-10">
              <div className="flex flex-col gap-5">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium uppercase -tracking-[0.02em] leading-[1] text-white">
                  Seanse
                </h2>
                <p className="max-w-[60ch] text-sm md:text-base text-white/65 leading-relaxed">
                  {buildMovieScreeningContext(
                    movie.title,
                    movie.productionYear,
                    screenings
                  )}
                </p>
              </div>
              {/* Framed panel keeps the data blocks apart from the prose lead. */}
              <div className="flex flex-col border border-white/15">
                <NextScreening
                  preferCity
                  className="border-0 px-5 py-5"
                  items={movieNextScreeningItems(screenings, movie)}
                />
                <MovieScreeningCities
                  className="border-t border-white/15 px-5 pt-5 pb-2"
                  movieTitle={movie.title}
                  screenings={screenings}
                />
              </div>
            </div>
            <div className="lg:col-span-8">
              <MovieScreenings
                screenings={screenings}
                movieTitle={movie.title}
                movieSlug={movie.slug}
                movieDuration={movie.duration}
              />
            </div>
          </div>
        )}
      </section>

      <MovieRecentVenues
        movieTitle={movie.title}
        venues={recentVenues}
        indexableCinemas={indexable?.cinemas ?? null}
      />

      <ProgrammeProfile
        heading={<>{movie.title} w&nbsp;polskich kinach</>}
        profile={profile}
        subject={{ kind: "movie" }}
        indexable={profileIndexable}
      />

      <section className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-12 md:pt-16 pb-16 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 gap-x-8 lg:gap-x-12">
          <div className="lg:col-span-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium uppercase -tracking-[0.02em] leading-[1] text-white">
              O filmie
            </h2>
          </div>
          <div className="lg:col-span-8">
            <MovieAbout movie={movie} />
          </div>
        </div>
      </section>

      {relatedMovies.length > 0 && (
        <section className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-12 md:pt-16 pb-16 md:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 gap-x-8 lg:gap-x-12">
            <div className="lg:col-span-4">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium uppercase -tracking-[0.02em] leading-[1] text-white">
                Podobne filmy
              </h2>
              <p className="mt-4 text-[10px] md:text-xs uppercase tracking-[0.25em] text-white/50">
                Gatunek, epoka i miasta, teraz w kinach
              </p>
            </div>
            <div className="lg:col-span-8">
              <RelatedMovies movies={relatedMovies} />
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
};

export default MoviePage;
