"use client";

import React, { useLayoutEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { IRepertoire } from "@/lib/client-screenings";
import { IGenre } from "@/interfaces/IMovies";
import { usePreferredCity } from "@/contexts/city-context";
import { clearFilterPending, takeHomePrefetch } from "@/lib/filter-pending";
import FilterBar from "./filter-bar";

// Result of an active (non-default) filter query. `null` upstream means the
// default, unfiltered view, for which the parent shows the server-rendered
// grid instead of any client-fetched data.
export interface FilteredResult {
  repertoire: IRepertoire;
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
  repertoire: IRepertoire;
  hasMore: boolean;
}

// Filtered results kept for the session, so coming back to the homepage
// (browser back included) renders the visitor's grid synchronously instead
// of flashing the default one while refetching. Same lifetime as the
// /api/screenings shared cache.
const RESULT_TTL_MS = 5 * 60 * 1000;
const resultCache = new Map<string, { data: HomeScreeningsData; at: number }>();

const readCachedResult = (query: string): HomeScreeningsData | null => {
  const entry = resultCache.get(query);
  if (!entry) return null;
  if (Date.now() - entry.at > RESULT_TTL_MS) {
    resultCache.delete(query);
    return null;
  }
  return entry.data;
};

const fetchHomeScreenings = (
  query: string,
  signal: AbortSignal
): Promise<HomeScreeningsData> =>
  fetch(`/api/screenings?${query}`, { signal }).then((res) => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json() as Promise<HomeScreeningsData>;
  });

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

  // Layout effect: a cached result (back navigation) is applied before the
  // browser paints, so the default grid never shows in between.
  useLayoutEffect(() => {
    // Wait for hydration so the preferred city is resolved before deciding
    // whether this is the default view or a filtered one.
    if (!isHydrated) return;

    // Default view (no filters, no stored location): no fetch, the parent
    // keeps showing the server-rendered grid.
    if (query === "") {
      onUpdating(false);
      onResult(null);
      clearFilterPending();
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

    const cached = readCachedResult(query);
    if (cached) {
      onResult({ ...cached, ...filterMeta });
      onUpdating(false);
      clearFilterPending();
      return;
    }

    onUpdating(true);
    // The head script may have started this exact request before hydration.
    const request =
      (takeHomePrefetch(query) as Promise<HomeScreeningsData> | null) ??
      fetchHomeScreenings(query, controller.signal);
    request
      .then((data) => {
        if (controller.signal.aborted) return;
        // A response cached by the browser before the October 2026 format
        // change has no repertoire; treat it like a failed request.
        if (!Array.isArray(data.repertoire?.groups)) {
          throw new Error("Unexpected /api/screenings response");
        }
        resultCache.set(query, { data, at: Date.now() });
        onResult({
          repertoire: data.repertoire,
          hasMore: data.hasMore,
          ...filterMeta,
        });
        onUpdating(false);
        clearFilterPending();
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        console.warn("Falling back to empty home screenings:", error);
        onResult({
          repertoire: { cities: [], groups: [] },
          hasMore: false,
          ...filterMeta,
        });
        onUpdating(false);
        clearFilterPending();
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
