"use client";

import React, { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { IScreeningGroup } from "@/interfaces/IScreenings";
import { IGenre } from "@/interfaces/IMovies";
import {
  ScreeningsTransitionProvider,
  useScreeningsTransition,
} from "@/contexts/screenings-transition-context";
import { usePreferredCity } from "@/contexts/city-context";
import { cn } from "@/lib/utils";
import { filterScreeningGroups } from "@/lib/screening-filters";
import { isVoivodeship } from "@/lib/voivodeships";
import EmptyState from "@/components/common/empty-state";
import FilterBar from "../../../../(home)/_components/screenings/filter-bar";
import ScreeningCard from "../../../../(home)/_components/screenings/screening-card";

interface GenreRepertoireProps {
  genreNameLower: string;
  screenings: IScreeningGroup[];
  genres: IGenre[];
}

const GenreRepertoireInner: React.FC<GenreRepertoireProps> = ({
  genreNameLower,
  screenings,
  genres,
}) => {
  const { isPending } = useScreeningsTransition();
  const searchParams = useSearchParams();
  const {
    cityId: preferredCityId,
    voivodeship: preferredVoivodeship,
    isHydrated,
  } = usePreferredCity();

  // The page is statically cached (ISR) with the genre's nationwide
  // repertoire; filters are applied here after hydration. An explicit
  // ?city= / ?voivodeship= deep link wins over the stored preference,
  // with city taking priority over voivodeship.
  const cityParam = Number(searchParams.get("city"));
  const urlCityId =
    !Number.isNaN(cityParam) && cityParam > 0 ? cityParam : null;
  const voivodeshipParam = searchParams.get("voivodeship");
  const urlVoivodeship =
    voivodeshipParam && isVoivodeship(voivodeshipParam)
      ? voivodeshipParam
      : null;

  let cityId: number | null = null;
  let voivodeship: string | null = null;
  if (urlCityId !== null) {
    cityId = urlCityId;
  } else if (urlVoivodeship !== null) {
    voivodeship = urlVoivodeship;
  } else if (isHydrated) {
    cityId = preferredCityId;
    voivodeship = preferredVoivodeship;
  }

  const visibleScreenings = useMemo(
    () =>
      filterScreeningGroups(screenings, {
        cityId,
        voivodeship,
        dateFrom: searchParams.get("dateFrom"),
        dateTo: searchParams.get("dateTo"),
        search: searchParams.get("search"),
      }),
    [screenings, cityId, voivodeship, searchParams]
  );

  return (
    <section className="px-6 md:px-12 lg:px-16 pb-20 md:pb-28">
      <div className="mb-10 md:mb-12">
        <FilterBar genres={genres} hideGenres />
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
        {visibleScreenings.length === 0 ? (
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
            {visibleScreenings.map((group) => (
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
