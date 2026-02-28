import React from "react";
import { IMovieSummary } from "@/interfaces/IMovies";
import MoviesGrid from "@/app/filmy/_components/movies-grid";

interface GenreMoviesProps {
  movies: readonly IMovieSummary[];
}

const GenreMovies: React.FC<GenreMoviesProps> = ({ movies }) => {
  return (
    <section className="flex flex-col gap-10">
      <MoviesGrid movies={movies} showHoverOverlay={false} />
    </section>
  );
};

export default GenreMovies;
