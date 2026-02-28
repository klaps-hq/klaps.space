import React from "react";
import MultiCityItem from "./multi-city-item";
import { IMultiCityMovie } from "@/interfaces/IMovies";

interface MultiCityListProps {
  movies: IMultiCityMovie[];
  activeMovieId: number;
  onMovieHover: (movie: IMultiCityMovie) => void;
}

const MultiCityList: React.FC<MultiCityListProps> = ({
  movies,
  activeMovieId,
  onMovieHover,
}) => {
  return (
    <ul className="flex flex-col gap-4">
      {movies.map((movie) => (
        <MultiCityItem
          key={movie.id}
          movie={movie}
          isActive={movie.id === activeMovieId}
          onHover={onMovieHover}
        />
      ))}
    </ul>
  );
};

export default MultiCityList;
