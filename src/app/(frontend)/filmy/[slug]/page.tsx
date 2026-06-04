import { Metadata } from "next";
import { getMoviePageData, getMovieBySlug } from "@/lib/movies";
import { tmdbImageUrl } from "@/lib/tmdb";
import { SITE_URL } from "@/lib/site-config";
import { BASE_OPEN_GRAPH, NOINDEX_FOLLOW, hasQueryParams } from "@/lib/seo";
import Footer from "@/app/(home)/_components/footer";
import MoviePoster from "@/components/common/movie-poster";
import MovieHero from "./_components/movie-hero";
import MovieAbout from "./_components/movie-about";
import MovieScreenings from "./_components/movie-screenings";

export const dynamic = "force-dynamic";

interface MoviePageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export const generateMetadata = async ({
  params,
  searchParams,
}: MoviePageProps): Promise<Metadata> => {
  const [{ slug }, queryParams] = await Promise.all([params, searchParams]);
  const movie = await getMovieBySlug(slug);

  const genreNames = movie.genres.map((g) => g.name).join(", ");
  const directorNames = movie.directors?.map((d) => d.name).join(", ");

  const descriptionParts = [
    `${movie.title} (${movie.productionYear})`,
    genreNames && `- ${genreNames}`,
    directorNames && `reż. ${directorNames}`,
    "- seanse specjalne w kinach studyjnych w Polsce.",
  ].filter(Boolean);

  const description = movie.description
    ? `${movie.description.slice(0, 130)} Sprawdź seanse w kinach studyjnych.`
    : descriptionParts.join(" ");

  const title = `${movie.title} - seanse w kinach (${movie.productionYear})`;
  const url = `${SITE_URL}/filmy/${movie.slug}`;
  const ogImages = movie.posterUrl
    ? [{ url: tmdbImageUrl(movie.posterUrl, "w780"), alt: movie.title }]
    : undefined;

  return {
    title,
    description,
    keywords: [
      movie.title,
      movie.titleOriginal,
      `${movie.title} seanse w kinach`,
      `${movie.title} kino`,
      `${movie.title} seans specjalny`,
      ...movie.genres.map((g) => g.name.toLowerCase()),
    ].filter(Boolean) as string[],
    alternates: {
      canonical: url,
    },
    ...(hasQueryParams(queryParams) && NOINDEX_FOLLOW),
    openGraph: {
      ...BASE_OPEN_GRAPH,
      type: "video.movie",
      url,
      title: `${movie.title} - seanse w kinach`,
      description,
      ...(ogImages && { images: ogImages }),
    },
    twitter: {
      card: "summary_large_image",
      title: `${movie.title} - seanse w kinach`,
      description,
      ...(movie.posterUrl && {
        images: [tmdbImageUrl(movie.posterUrl, "w780")],
      }),
    },
  };
};

const MoviePage = async ({ params }: MoviePageProps) => {
  const { slug } = await params;
  const { movie, screenings } = await getMoviePageData(slug);

  return (
    <main className="bg-black min-h-screen text-white">
      <MovieHero movie={movie} />

      <section className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-12 md:pt-16 pb-14 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 gap-x-8 lg:gap-x-12">
          <div className="lg:col-span-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium uppercase -tracking-[0.02em] leading-[1] text-white">
              Seanse
            </h2>
          </div>
          <div className="lg:col-span-8">
            <MovieScreenings screenings={screenings} />
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-12 md:pt-16 pb-16 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 gap-x-8 lg:gap-x-12">
          <div className="lg:col-span-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium uppercase -tracking-[0.02em] leading-[1] text-white">
              O filmie
            </h2>
            {movie.posterUrl && (
              <div className="mt-8 md:mt-10 aspect-[2/3] w-full max-w-[200px] overflow-hidden bg-white/5">
                <MoviePoster
                  posterUrl={movie.posterUrl}
                  title={movie.title}
                  width={320}
                  height={480}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
          <div className="lg:col-span-8">
            <MovieAbout movie={movie} />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default MoviePage;
