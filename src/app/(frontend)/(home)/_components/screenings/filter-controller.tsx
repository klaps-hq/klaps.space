"use client";

import React, { useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { IScreeningGroup } from "@/interfaces/IScreenings";
import { IGenre } from "@/interfaces/IMovies";
import { usePreferredCity } from "@/contexts/city-context";
import FilterBar from "./filter-bar";

// Result of an active (non-default) filter query. `null` upstream means the
// default, unfiltered view, for which the parent shows the server-rendered
// grid instead of any client-fetched data.
export interface FilteredResult {
  screenings: IScreeningGroup[];
  hasMore: boolean;
  seeAllHref: string;
  selectedGenreIds: number[];
  dateFrom: string | null;
  dateTo: string | null;
  search: string | null;
}

interface ScreeningsFilterControllerProps {
  genres: IGenre[];
  // Stable setters from the parent (useState dispatchers): result of the
  // active filter, or null to fall back to the server-rendered default grid.
  onResult: (result: FilteredResult | null) => void;
  onUpdating: (updating: boolean) => void;
}

interface HomeScreeningsData {
  screenings: IScreeningGroup[];
  hasMore: boolean;
}

const parseGenreIds = (raw: string): number[] =>
  raw
    .split(",")
    .map((v) => v.trim())
    .filter((v) => v.length > 0 && /^\d+$/.test(v))
    .map(Number);

// The interactive filter controls live here, isolated behind a Suspense
// boundary: this component reads useSearchParams (which opts its subtree out
// of static prerendering), while the default screenings grid is rendered by
// the server as a sibling and therefore stays in the static HTML. On an
// active query this fetches /api/screenings and hands the result to the
// parent, which swaps the grid; an empty query keeps the server grid.
const ScreeningsFilterController: React.FC<ScreeningsFilterControllerProps> = ({
  genres,
  onResult,
  onUpdating,
}) => {
  const searchParams = useSearchParams();
  const {
    cityId: preferredCityId,
    voivodeship: preferredVoivodeship,
    isHydrated,
  } = usePreferredCity();

  // URL params win over the stored preference; the preference applies only
  // after hydration so the first client render matches the SSR markup.
  const urlCity = searchParams.get("city");
  const urlVoivodeship = searchParams.get("voivodeship");
  const city =
    urlCity ??
    (isHydrated && preferredCityId !== null ? String(preferredCityId) : null);
  const voivodeship = city
    ? null
    : (urlVoivodeship ?? (isHydrated ? preferredVoivodeship : null));

  const genresParam = searchParams.get("genres") ?? "";
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");
  const search = searchParams.get("search");

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    else if (voivodeship) params.set("voivodeship", voivodeship);
    if (genresParam) params.set("genres", genresParam);
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);
    if (search) params.set("search", search);
    return params.toString();
  }, [city, voivodeship, genresParam, dateFrom, dateTo, search]);

  useEffect(() => {
    // Wait for hydration so the preferred city is resolved before deciding
    // whether this is the default view or a filtered one.
    if (!isHydrated) return;

    // Default view (no filters, no stored location): no fetch, the parent
    // keeps showing the server-rendered grid.
    if (query === "") {
      onUpdating(false);
      onResult(null);
      return;
    }

    const controller = new AbortController();
    const seeAllHref = `/seanse?${query}`;
    const filterMeta = {
      seeAllHref,
      selectedGenreIds: parseGenreIds(genresParam),
      dateFrom,
      dateTo,
      search,
    };

    onUpdating(true);
    fetch(`/api/screenings?${query}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<HomeScreeningsData>;
      })
      .then((data) => {
        onResult({
          screenings: data.screenings,
          hasMore: data.hasMore,
          ...filterMeta,
        });
        onUpdating(false);
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        console.warn("Falling back to empty home screenings:", error);
        onResult({ screenings: [], hasMore: false, ...filterMeta });
        onUpdating(false);
      });

    return () => controller.abort();
  }, [
    isHydrated,
    query,
    genresParam,
    dateFrom,
    dateTo,
    search,
    onResult,
    onUpdating,
  ]);

  return <FilterBar genres={genres} />;
};

export default ScreeningsFilterController;
