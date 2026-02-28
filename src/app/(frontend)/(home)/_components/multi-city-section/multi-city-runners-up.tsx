import React from "react";
import { IMultiCityMovie } from "@/interfaces/IMovies";

interface MultiCityRunnersUpProps {
  movies: IMultiCityMovie[];
}

const MultiCityRunnersUp: React.FC<MultiCityRunnersUpProps> = ({ movies }) => {
  if (movies.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 mt-6 pt-6 border-t border-neutral-800">
      <span className="text-neutral-600 text-xs uppercase tracking-widest">
        Tuż za podium
      </span>
      {movies.map((movie) => (
        <div
          key={movie.id}
          className="flex items-baseline justify-between gap-4"
        >
          <span className="text-neutral-300 text-sm">{movie.title}</span>
          <span className="text-neutral-600 text-xs whitespace-nowrap">
            {movie.citiesCount} miast
          </span>
        </div>
      ))}
    </div>
  );
};

export default MultiCityRunnersUp;
