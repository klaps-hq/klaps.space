import React, { useCallback } from "react";
import Link from "next/link";
import { IMultiCityMovie } from "@/interfaces/IMovies";
import { cn } from "@/lib/utils";

interface MultiCityItemProps {
  movie: IMultiCityMovie;
  isActive: boolean;
  onHover: (movie: IMultiCityMovie) => void;
}

const MultiCityItem: React.FC<MultiCityItemProps> = ({
  movie,
  isActive,
  onHover,
}) => {
  const formattedCityLabel =
    movie.citiesCount === 1
      ? "miasto"
      : movie.citiesCount < 5
      ? "miasta"
      : "miast";

  const handleMouseEnter = useCallback(() => {
    onHover(movie);
  }, [onHover, movie]);

  return (
    <li
      className={cn(
        "flex items-baseline justify-between gap-4 border-b border-neutral-800 pb-4 transition-colors duration-200 cursor-pointer",
        isActive && "border-blood-red/30"
      )}
      onMouseEnter={handleMouseEnter}
      role="button"
      tabIndex={0}
      aria-label={`Pokaż szczegóły filmu ${movie.title}`}
      onFocus={handleMouseEnter}
    >
      <Link
        href={`/filmy/${movie.slug}`}
        className={cn(
          "text-lg md:text-xl font-semibold transition-colors duration-200",
          isActive ? "text-blood-red" : "text-white hover:text-blood-red"
        )}
      >
        {movie.title} ({movie.productionYear})
      </Link>
      <span
        className={cn(
          "text-sm whitespace-nowrap transition-colors duration-200",
          isActive ? "text-neutral-300" : "text-neutral-500"
        )}
      >
        {movie.citiesCount} {formattedCityLabel}
      </span>
    </li>
  );
};

export default MultiCityItem;
