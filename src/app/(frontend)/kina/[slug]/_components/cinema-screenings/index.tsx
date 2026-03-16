"use client";

import React from "react";
import { IScreeningGroup } from "@/interfaces/IScreenings";
import { IGenre } from "@/interfaces/IMovies";
import SectionHeader from "@/components/common/section-header";
import MoviesGrid from "@/app/filmy/_components/movies-grid";
import EmptyState from "@/components/common/empty-state";
import {
  ScreeningsTransitionProvider,
  useScreeningsTransition,
} from "@/contexts/screenings-transition-context";
import { cn } from "@/lib/utils";
import CinemaScreeningsFilters from "./cinema-screenings-filters";

interface CinemaScreeningsProps {
  screenings: IScreeningGroup[];
  genres: IGenre[];
}

const CinemaScreeningsContent: React.FC<CinemaScreeningsProps> = ({
  screenings,
  genres,
}) => {
  const { isPending } = useScreeningsTransition();
  const movies = screenings.map((s) => s.movie);

  return (
    <section
      className={cn(
        "flex flex-col gap-10 transition-opacity duration-200",
        isPending && "opacity-50 pointer-events-none"
      )}
    >
      <SectionHeader prefix="Seanse dla kina" title="Aktualne seanse" />

      <CinemaScreeningsFilters genres={genres} />

      {screenings.length === 0 ? (
        <EmptyState
          headline="Brak seansow"
          description="Nie znaleziono seansow pasujacych do wybranych filtrow."
        />
      ) : (
        <MoviesGrid
          movies={movies}
          screenings={screenings}
          showDescription={false}
        />
      )}
    </section>
  );
};

const CinemaScreenings: React.FC<CinemaScreeningsProps> = (props) => (
  <ScreeningsTransitionProvider>
    <CinemaScreeningsContent {...props} />
  </ScreeningsTransitionProvider>
);

export default CinemaScreenings;
