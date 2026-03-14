import React from "react";
import { IMultiCityMovie } from "@/interfaces/IMovies";
import MultiCityPosterImage from "./multi-city-poster-image";
import MultiCityPosterDetails from "./multi-city-poster-details";

interface MultiCityPosterProps {
  movie: IMultiCityMovie;
}

const MultiCityPoster: React.FC<MultiCityPosterProps> = ({ movie }) => {
  if (!movie.posterUrl) return null;

  return (
    <div className="hidden lg:flex gap-8 items-start animate-in fade-in duration-300">
      <MultiCityPosterImage posterUrl={movie.posterUrl} title={movie.title} />

      <div className="flex flex-col gap-4 pt-4">
        <MultiCityPosterDetails movie={movie} />
      </div>
    </div>
  );
};

export default MultiCityPoster;
