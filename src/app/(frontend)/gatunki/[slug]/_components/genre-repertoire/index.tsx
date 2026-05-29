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

interface GenreRepertoireProps {
  genreName: string;
  genreNameLower: string;
  screenings: IScreeningGroup[];
  genres: IGenre[];
}

const GenreRepertoireInner: React.FC<GenreRepertoireProps> = ({
  genreName,
  genreNameLower,
  screenings,
  genres,
}) => {
  const { isPending } = useScreeningsTransition();

  return (
    <section className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-12 md:pt-16 pb-20 md:pb-28">
      <h2 className="mb-8 md:mb-10 text-2xl md:text-4xl lg:text-5xl leading-[1.05] -tracking-[0.02em] max-w-[26ch] text-white font-medium">
        Aktualne seanse: {genreName}
      </h2>

      <div className="mb-10 md:mb-12">
        <FilterBar genres={genres} hideGenres />
      </div>

      <div
        className={cn(
          "transition-opacity duration-200",
          isPending && "opacity-50 pointer-events-none"
        )}
      >
        {screenings.length === 0 ? (
          <EmptyState
            description={
              <>
                Brak seansów z&nbsp;gatunku {genreNameLower} pasujących do
                wybranych filtrów. Spróbuj zmienić zakres dat, miasto lub
                frazę.
              </>
            }
            cta={{ href: "/gatunki", label: "Inne gatunki" }}
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

const GenreRepertoire: React.FC<GenreRepertoireProps> = (props) => (
  <ScreeningsTransitionProvider>
    <GenreRepertoireInner {...props} />
  </ScreeningsTransitionProvider>
);

export default GenreRepertoire;
