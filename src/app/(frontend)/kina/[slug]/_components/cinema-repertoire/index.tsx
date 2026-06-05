"use client";

import React from "react";
import { IScreeningGroup } from "@/interfaces/IScreenings";
import { IGenre } from "@/interfaces/IMovies";
import {
  ScreeningsTransitionProvider,
  useScreeningsTransition,
} from "@/contexts/screenings-transition-context";
import { cn } from "@/lib/utils";
import EmptyState from "@/components/common/empty-state";
import FilterBar from "../../../../(home)/_components/screenings/filter-bar";
import ScreeningCard from "../../../../(home)/_components/screenings/screening-card";

interface CinemaRepertoireProps {
  cinemaName: string;
  citySlug: string;
  cityName: string;
  cityForCopy: string;
  screenings: IScreeningGroup[];
  genres: IGenre[];
}

const CinemaRepertoireInner: React.FC<CinemaRepertoireProps> = ({
  cinemaName,
  citySlug,
  cityName,
  cityForCopy,
  screenings,
  genres,
}) => {
  const { isPending } = useScreeningsTransition();

  return (
    <section className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-12 md:pt-16 pb-20 md:pb-28">
      <h2 className="mb-8 md:mb-10 text-2xl md:text-4xl lg:text-5xl leading-[1.05] -tracking-[0.02em] max-w-[26ch] text-white font-medium">
        Repertuar kina {cinemaName}
      </h2>

      <div className="mb-10 md:mb-12">
        <FilterBar genres={genres} hideCity />
        <div
          className="mt-4 md:mt-5 -mx-6 md:-mx-12 lg:-mx-16 h-px bg-white/10"
          aria-hidden="true"
        />
      </div>

      <div
        className={cn(
          "transition-opacity duration-200",
          isPending && "opacity-50 pointer-events-none"
        )}
      >
        {screenings.length === 0 ? (
          <EmptyState
            description="Brak seansów pasujących do wybranych filtrów. Spróbuj zmienić zakres dat, gatunek lub frazę."
            cta={{
              href: `/miasta/${citySlug}`,
              label: `Inne kina w ${cityName}`,
            }}
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-x-4 md:gap-x-6 gap-y-10 md:gap-y-12">
            {screenings.map((group) => (
              <ScreeningCard key={group.movie.id} group={group} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const CinemaRepertoire: React.FC<CinemaRepertoireProps> = (props) => (
  <ScreeningsTransitionProvider>
    <CinemaRepertoireInner {...props} />
  </ScreeningsTransitionProvider>
);

export default CinemaRepertoire;
