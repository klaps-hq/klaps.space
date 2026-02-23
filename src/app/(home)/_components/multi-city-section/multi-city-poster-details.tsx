import React from "react";
import LinkWithArrow from "@/components/ui/read-more-link";
import { IMultiCityMovie } from "@/interfaces/IMovies";

interface MultiCityPosterDetailsProps {
  movie: IMultiCityMovie;
}

const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) return `${remainingMinutes} min`;
  if (remainingMinutes === 0) return `${hours}h`;
  return `${hours}h ${remainingMinutes}min`;
};

const formatCityLabel = (count: number): string => {
  if (count === 1) return "miasto";
  if (count < 5) return "miasta";
  return "miast";
};

const MultiCityPosterDetails: React.FC<MultiCityPosterDetailsProps> = ({
  movie,
}) => {
  const metaInfo = [
    movie.productionYear,
    movie.duration ? formatDuration(movie.duration) : null,
    `${movie.citiesCount} ${formatCityLabel(movie.citiesCount)}`,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      <span className="text-blood-red text-sm uppercase tracking-widest">
        Najczęściej grany
      </span>
      <h3 className="text-white text-2xl xl:text-3xl font-bold leading-tight">
        {movie.title}
      </h3>
      <span className="text-neutral-500 text-sm">{metaInfo}</span>
      {movie.description && (
        <p className="text-neutral-500 text-sm leading-relaxed max-w-xs line-clamp-4">
          {movie.description}
        </p>
      )}
      <LinkWithArrow href={`/filmy/${movie.slug}`} label="Zobacz szczegóły" />
    </>
  );
};

export default MultiCityPosterDetails;
