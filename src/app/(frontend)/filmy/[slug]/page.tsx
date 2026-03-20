import { getMoviePageData } from "@/lib/movies";
import MovieHero from "./_components/movie-hero";
import MovieScreenings from "./_components/movie-screenings";

export const dynamic = "force-dynamic";

type MoviePageProps = {
  params: Promise<{ slug: string }>;
};

const MoviePage = async ({ params }: MoviePageProps) => {
  const { slug } = await params;
  const { movie, screenings } = await getMoviePageData(slug);

  return (
    <main className="bg-black min-h-screen lg:h-screen lg:overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:h-full">
        <div className="lg:overflow-y-auto lg:h-full scrollbar-styled">
          <MovieHero movie={movie} />
        </div>
        <div className="lg:overflow-y-auto lg:h-full scrollbar-styled bg-neutral-900/40">
          <MovieScreenings screenings={screenings} />
        </div>
      </div>
    </main>
  );
};

export default MoviePage;
