import { getMoviePageData } from "@/lib/movies";
import Footer from "@/app/(home)/_components/footer";
import MovieHero from "./_components/movie-hero";
import MovieDetailsSections from "./_components/movie-details-sections";
import MovieScreenings from "./_components/movie-screenings";
import MovieTrailer from "./_components/movie-trailer";

export const dynamic = "force-dynamic";

interface MoviePageProps {
  params: Promise<{ slug: string }>;
}

const MoviePage = async ({ params }: MoviePageProps) => {
  const { slug } = await params;
  const { movie, screenings } = await getMoviePageData(slug);

  return (
    <main className="bg-black min-h-screen">
      <MovieHero movie={movie} />
      <MovieDetailsSections movie={movie} />
      {movie.videoUrl && <MovieTrailer videoUrl={movie.videoUrl} />}
      <MovieScreenings screenings={screenings} />
      <Footer />
    </main>
  );
};

export default MoviePage;
