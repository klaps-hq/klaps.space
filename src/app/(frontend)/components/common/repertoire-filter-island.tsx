"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { IScreeningGroup } from "@/interfaces/IScreenings";
import { IGenre } from "@/interfaces/IMovies";
import { usePreferredCity } from "@/contexts/city-context";
import {
  filterScreeningGroups,
  parseGenreIdsParam,
} from "@/lib/screening-filters";
import { isVoivodeship } from "@/lib/voivodeships";
import FilterBar from "../../(home)/_components/screenings/filter-bar";

interface RepertoireFilterIslandProps {
  screenings: IScreeningGroup[];
  genres: IGenre[];
  hideCity?: boolean;
  hideGenres?: boolean;
  // Listing pages that span the whole country (genres) also narrow by the
  // city stored in the visitor's preference; per-city and per-cinema pages
  // are already scoped, so they leave this off.
  usePreferredLocation?: boolean;
  // Stable setter from the parent (a useState dispatcher): the filtered
  // groups, or null for the default view, where the parent keeps showing
  // the server-rendered grid.
  onResult: (result: IScreeningGroup[] | null) => void;
}

// The interactive filter controls live here, isolated behind a Suspense
// boundary: this component reads useSearchParams (which opts its subtree out
// of static prerendering), while the default repertoire grid is rendered by
// the server as a sibling and therefore stays in the static HTML. Filtering
// is in-memory because the page is cached (ISR) with the full data set.
const RepertoireFilterIsland: React.FC<RepertoireFilterIslandProps> = ({
  screenings,
  genres,
  hideCity = false,
  hideGenres = false,
  usePreferredLocation = false,
  onResult,
}) => {
  const searchParams = useSearchParams();
  const {
    cityId: preferredCityId,
    voivodeship: preferredVoivodeship,
    isHydrated,
  } = usePreferredCity();

  const genresParam = searchParams.get("genres") ?? "";
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");
  const search = searchParams.get("search");

  // An explicit ?city= / ?voivodeship= deep link wins over the stored
  // preference, with city taking priority over voivodeship.
  const cityParam = Number(searchParams.get("city"));
  const urlCityId = !Number.isNaN(cityParam) && cityParam > 0 ? cityParam : null;
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
  } else if (usePreferredLocation && isHydrated) {
    cityId = preferredCityId;
    voivodeship = preferredVoivodeship;
  }

  const hasFilter =
    genresParam.length > 0 ||
    Boolean(dateFrom) ||
    Boolean(dateTo) ||
    Boolean(search) ||
    cityId !== null ||
    voivodeship !== null;

  useEffect(() => {
    // Wait for hydration so the stored location is resolved before deciding
    // whether this is the default view or a filtered one; without it the
    // server grid would flash and then be replaced.
    if (usePreferredLocation && !isHydrated) return;

    if (!hasFilter) {
      onResult(null);
      return;
    }

    onResult(
      filterScreeningGroups(screenings, {
        genreIds: parseGenreIdsParam(genresParam),
        cityId,
        voivodeship,
        dateFrom,
        dateTo,
        search,
      })
    );
  }, [
    screenings,
    genresParam,
    dateFrom,
    dateTo,
    search,
    cityId,
    voivodeship,
    hasFilter,
    isHydrated,
    usePreferredLocation,
    onResult,
  ]);

  return <FilterBar genres={genres} hideCity={hideCity} hideGenres={hideGenres} />;
};

export default RepertoireFilterIsland;
