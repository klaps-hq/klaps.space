import React from "react";
import { IMovieSummary } from "@/interfaces/IMovies";
import MovieCard from "./movie-card";
import EmptyState from "@/components/common/empty-state";
import { IScreeningGroup } from "@/interfaces/IScreenings";

interface MoviesGridProps {
  movies: readonly IMovieSummary[];
  showDescription?: boolean;
  screenings?: IScreeningGroup[] | null;
  showHoverOverlay?: boolean;
}

const MoviesGrid: React.FC<MoviesGridProps> = ({
  movies,
  showDescription = false,
  screenings,
  showHoverOverlay = true,
}) => {
  if (movies.length === 0) {
    return (
      <EmptyState
        headline="Brak filmów"
        description="Nie znaleziono filmów do wyświetlenia. Sprawdź ponownie później."
      />
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-x-6 gap-y-12">
      {movies.map((movie) => {
        const screening = screenings?.find((s) => s.movie.id === movie.id);

        return (
          <MovieCard
            key={movie.id}
            movie={movie}
            screeningsCount={screening?.summary.screeningsCount}
            cinemasCount={screening?.summary.cinemasCount}
            showDescription={showDescription}
            showHoverOverlay={showHoverOverlay}
          />
        );
      })}
    </div>
  );
};

export default MoviesGrid;
