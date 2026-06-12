import { Metadata } from "next";
import { getMoviePageData, getMovieBySlug, getMovies } from "@/lib/movies";
import { getMovieScreenings, getScreenings } from "@/lib/screenings";
import { SITE_URL } from "@/lib/site-config";
import { BASE_OPEN_GRAPH, NOINDEX_FOLLOW, pluralPl } from "@/lib/seo";
import Footer from "@/app/(home)/_components/footer";
import SiteHeader from "@/components/common/site-header";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import MovieHero from "./_components/movie-hero";
import MovieAbout from "./_components/movie-about";
import MovieScreenings from "./_components/movie-screenings";
import RelatedMovies from "./_components/related-movies";

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

  const screenings = await getMovieScreenings({
    movieId: movie.id.toString(),
  }).catch(() => []);
  const screeningsCount = screenings.length;

  const genreNames = movie.genres.map((g) => g.name).join(", ");
  const directorNames = movie.directors?.map((d) => d.name).join(", ");
  // Top-billed cast keeps description-less movies from sharing one
  // near-identical fallback snippet.
  const actorNames = movie.actors
    ?.slice(0, 2)
    .map((a) => a.name)
    .join(", ");

  // Real screening counts in the description improve SERP CTR and uniqueness.
  const screeningsSuffix =
    screeningsCount > 0
      ? `Sprawdź ${screeningsCount} ${pluralPl(screeningsCount, "seans", "seanse", "seansów")} w kinach studyjnych.`
      : "Sprawdź seanse w kinach studyjnych.";

  const metaLine = [
    genreNames,
    directorNames && `reż. ${directorNames}`,
    actorNames && `wyst. ${actorNames}`,
  ]
    .filter(Boolean)
    .join(", ");
  const fallbackDescription = `${movie.title} (${movie.productionYear})${metaLine ? ` - ${metaLine}` : ""}. ${screeningsSuffix}`;

  // Truncate at a word boundary so the snippet never ends mid-word.
  const excerpt =
    movie.description && movie.description.length > 120
      ? `${movie.description.slice(0, 120).replace(/\s+\S*$/, "")}…`
      : movie.description;

  const description = excerpt
    ? `${excerpt} ${screeningsSuffix}`
    : fallbackDescription;

  const title = `${movie.title} (${movie.productionYear}) - seanse w kinach`;
  const url = `${SITE_URL}/filmy/${movie.slug}`;

  // Movies without upcoming screenings are thin TMDB duplicates - keep
  // them out of the index until they have showtimes again. Query-param
  // duplicates are handled by the canonical URL alone.
  const noindex = screeningsCount === 0;

  return {
    title,
    description,
    ...(noindex ? NOINDEX_FOLLOW : { alternates: { canonical: url } }),
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
  // Instant blurred preview baked into the cached HTML while the full-size
  // backdrop streams in; precomputed by the scraper, served by the API.
  const backdropBlurDataUrl = movie.backdropBlurDataUrl ?? null;

  // Internal linking: up to 6 movies sharing the primary genre.
  const primaryGenre = movie.genres[0];
  const relatedMovies = primaryGenre
    ? (
        await getMovies({ genreId: primaryGenre.id.toString(), limit: 7 })
      ).data
        .filter((related) => related.id !== movie.id)
        .slice(0, 6)
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
            <div className="lg:col-span-4">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium uppercase -tracking-[0.02em] leading-[1] text-white">
                Seanse
              </h2>
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
              {primaryGenre && (
                <p className="mt-4 text-[10px] md:text-xs uppercase tracking-[0.25em] text-white/40">
                  Gatunek: {primaryGenre.name}
                </p>
              )}
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
