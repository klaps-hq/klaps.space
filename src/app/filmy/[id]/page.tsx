import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMovieById } from "@/lib/movies";
import { getMovieScreenings } from "@/lib/screenings";
import { getPreferredCityId } from "@/lib/get-preferred-city";
import { ApiNotFoundError } from "@/lib/client";
import SectionDivider from "@/components/ui/section-divider";
import MovieHero from "./_components/movie-hero";
import MovieDetailsSections from "./_components/movie-details-sections";
import MovieScreenings from "./_components/movie-screenings";
import MovieTrailer from "./_components/movie-trailer";
import JsonLd from "@/components/common/json-ld";
import { SITE_URL } from "@/lib/site-config";
import { IMovie } from "@/interfaces/IMovies";

export const dynamic = "force-dynamic";

type MoviePageProps = {
  params: Promise<{ id: string }>;
};

const buildMovieJsonLd = (movie: IMovie) => {
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Movie",
    name: movie.title,
    url: `${SITE_URL}/filmy/${movie.id}`,
    description: movie.description ?? undefined,
    dateCreated: movie.productionYear.toString(),
    genre: movie.genres.map((g) => g.name),
  };

  if (movie.titleOriginal) {
    jsonLd.alternateName = movie.titleOriginal;
  }

  if (movie.duration) {
    const hours = Math.floor(movie.duration / 60);
    const minutes = movie.duration % 60;
    jsonLd.duration = `PT${hours}H${minutes}M`;
  }

  if (movie.posterUrl) {
    jsonLd.image = movie.posterUrl;
  }

  if (movie.directors?.length) {
    jsonLd.director = movie.directors.map((d) => ({
      "@type": "Person",
      name: d.name,
    }));
  }

  if (movie.actors?.length) {
    jsonLd.actor = movie.actors.map((a) => ({
      "@type": "Person",
      name: a.name,
    }));
  }

  return jsonLd;
};

const MoviePage = async ({ params }: MoviePageProps) => {
  const { id } = await params;
  const cityId = await getPreferredCityId();

  let movie;
  let screenings;

  try {
    [movie, screenings] = await Promise.all([
      getMovieById(Number(id)),
      getMovieScreenings({ movieId: id, cityId, limit: 1000 }),
    ]);
  } catch (error) {
    if (error instanceof ApiNotFoundError) {
      notFound();
    }
    throw error;
  }

  return (
    <>
      <JsonLd data={buildMovieJsonLd(movie)} />
      <main className="bg-black min-h-screen px-8 py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-16">
          <MovieHero movie={movie} />

          <SectionDivider />
          <MovieDetailsSections movie={movie} />

          {movie.videoUrl && (
            <>
              <SectionDivider />
              <MovieTrailer videoUrl={movie.videoUrl} />
            </>
          )}

          <SectionDivider />
          <MovieScreenings screenings={screenings} />
        </div>
      </main>
    </>
  );
};

export const generateMetadata = async ({
  params,
}: MoviePageProps): Promise<Metadata> => {
  const { id } = await params;
  const movie = await getMovieById(Number(id));

  const description = movie.description
    ? movie.description.slice(0, 160)
    : `${movie.title} (${movie.productionYear}) - szczegóły filmu w serwisie Klaps.`;

  return {
    title: movie.title,
    description,
    alternates: {
      canonical: `${SITE_URL}/filmy/${id}`,
    },
  };
};

export default MoviePage;
