"use client";

import React, { useState, useCallback } from "react";
import { IMultiCityMovie } from "@/interfaces/IMovies";
import MultiCityList from "./multi-city-list";
import MultiCityPoster from "./multi-city-poster";

interface MultiCityInteractiveProps {
  movies: IMultiCityMovie[];
  defaultMovie: IMultiCityMovie;
}

const MultiCityInteractive: React.FC<MultiCityInteractiveProps> = ({
  movies,
  defaultMovie,
}) => {
  const [activeMovie, setActiveMovie] = useState<IMultiCityMovie>(defaultMovie);

  const handleMovieHover = useCallback((movie: IMultiCityMovie) => {
    setActiveMovie(movie);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
      <MultiCityList
        movies={movies}
        activeMovieId={activeMovie.id}
        onMovieHover={handleMovieHover}
      />
      <MultiCityPoster key={activeMovie.id} movie={activeMovie} />
    </div>
  );
};

export default MultiCityInteractive;
