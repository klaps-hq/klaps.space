import { getMoviePageData } from "@/lib/movies";
import SectionDivider from "@/components/ui/section-divider";
import MovieHero from "./_components/movie-hero";
import MovieDetailsSections from "./_components/movie-details-sections";
import MovieScreenings from "./_components/movie-screenings";
import MovieTrailer from "./_components/movie-trailer";
import Breadcrumbs from "@/components/ui/breadcrumbs";

export const revalidate = 300;

type MoviePageProps = {
  params: Promise<{ slug: string }>;
};

const MoviePage = async ({ params }: MoviePageProps) => {
  const { slug } = await params;
  const { movie, screenings } = await getMoviePageData(slug);

  return (
    <main className="bg-black min-h-screen px-8 py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-16">
        <Breadcrumbs
          items={[
            { name: "Filmy", href: "/filmy" },
            { name: movie.title },
          ]}
        />
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
  );
};

export default MoviePage;
