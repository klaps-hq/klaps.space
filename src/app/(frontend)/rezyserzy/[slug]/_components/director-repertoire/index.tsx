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
import {
  filterScreeningGroups,
  parseGenreIdsParam,
} from "@/lib/screening-filters";
import { isVoivodeship } from "@/lib/voivodeships";
import EmptyState from "@/components/common/empty-state";
import FilterBar from "../../../../(home)/_components/screenings/filter-bar";
import ScreeningCard from "../../../../(home)/_components/screenings/screening-card";

interface DirectorRepertoireProps {
  directorName: string;
  screenings: IScreeningGroup[];
  genres: IGenre[];
}

const DirectorRepertoireInner: React.FC<DirectorRepertoireProps> = ({
  directorName,
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

  // The page is statically cached (ISR) with the director's nationwide
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
        genreIds: parseGenreIdsParam(searchParams.get("genres")),
        dateFrom: searchParams.get("dateFrom"),
        dateTo: searchParams.get("dateTo"),
        search: searchParams.get("search"),
      }),
    [screenings, cityId, voivodeship, searchParams]
  );

  return (
    <section className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-8 md:pt-12 pb-20 md:pb-28">
      <h2 className="mb-6 md:mb-8 text-2xl md:text-4xl lg:text-5xl leading-[1.05] -tracking-[0.02em] max-w-[26ch] text-white font-medium">
        Repertuar - {directorName}
      </h2>

      <div className="mb-10 md:mb-12">
        <FilterBar genres={genres} />
        <div
          className="mt-8 md:mt-12 -mx-6 md:-mx-12 lg:-mx-16 h-px bg-white/10"
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
                Brak seansów filmów w&nbsp;reżyserii {directorName} pasujących
                do wybranych filtrów. Spróbuj zmienić miasto, gatunek lub
                zakres dat.
              </>
            }
            cta={{ href: "/rezyserzy", label: "Inni reżyserzy" }}
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

const DirectorRepertoire: React.FC<DirectorRepertoireProps> = (props) => (
  <ScreeningsTransitionProvider>
    <DirectorRepertoireInner {...props} />
  </ScreeningsTransitionProvider>
);

export default DirectorRepertoire;
