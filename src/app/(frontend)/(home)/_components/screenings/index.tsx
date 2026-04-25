import React from "react";
import { IScreeningGroup } from "@/interfaces/IScreenings";
import { PaginatedResponse } from "@/interfaces/IMovies";
import { getPaginatedScreenings } from "@/lib/screenings";
import { getGenres } from "@/lib/genres";
import { getPreferredCityId } from "@/lib/get-preferred-city";
import ScreeningsSection from "./screenings-section";

const HOMEPAGE_LIMIT = 24;

interface ScreeningsSearchParams {
  city?: string;
  genres?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

interface ScreeningsProps {
  searchParams: ScreeningsSearchParams;
}

const buildSeeAllHref = (searchParams: ScreeningsSearchParams): string => {
  const params = new URLSearchParams();
  if (searchParams.city) params.set("city", searchParams.city);
  if (searchParams.genres) params.set("genre", searchParams.genres);
  if (searchParams.dateFrom) params.set("dateFrom", searchParams.dateFrom);
  if (searchParams.dateTo) params.set("dateTo", searchParams.dateTo);
  if (searchParams.search) params.set("search", searchParams.search);
  const qs = params.toString();
  return qs ? `/seanse?${qs}` : "/seanse";
};

const parseGenreIds = (raw: string | undefined): string[] => {
  if (!raw) return [];
  return raw
    .split(",")
    .map((v) => v.trim())
    .filter((v) => v.length > 0 && /^\d+$/.test(v));
};

const mergeScreeningGroups = (
  groups: IScreeningGroup[][]
): IScreeningGroup[] => {
  const byMovieId = new Map<number, IScreeningGroup>();
  for (const list of groups) {
    for (const group of list) {
      if (!byMovieId.has(group.movie.id)) {
        byMovieId.set(group.movie.id, group);
      }
    }
  }
  return Array.from(byMovieId.values());
};

const unwrapResponse = (
  response: IScreeningGroup[] | PaginatedResponse<IScreeningGroup>
): IScreeningGroup[] =>
  Array.isArray(response) ? response : [...response.data];

const Screenings = async ({ searchParams }: ScreeningsProps) => {
  const cityId = await getPreferredCityId(searchParams);
  const genreIds = parseGenreIds(searchParams.genres);

  const sharedFilters = {
    cityId,
    dateFrom: searchParams.dateFrom,
    dateTo: searchParams.dateTo,
    search: searchParams.search,
  };

  const screeningsPromise =
    genreIds.length > 1
      ? Promise.all(
          genreIds.map((id) =>
            getPaginatedScreenings({ ...sharedFilters, genreId: id }).then(
              unwrapResponse
            )
          )
        ).then(mergeScreeningGroups)
      : getPaginatedScreenings({
          ...sharedFilters,
          genreId: genreIds[0],
        }).then(unwrapResponse);

  const [allScreenings, genres] = await Promise.all([
    screeningsPromise,
    getGenres(),
  ]);

  const total = allScreenings.length;
  const screenings = allScreenings.slice(0, HOMEPAGE_LIMIT);
  const hasMore = total > screenings.length;

  return (
    <ScreeningsSection
      screenings={screenings}
      genres={genres}
      total={total}
      seeAllHref={buildSeeAllHref(searchParams)}
      hasMore={hasMore}
      selectedGenreIds={genreIds.map(Number)}
      dateFrom={searchParams.dateFrom ?? null}
      dateTo={searchParams.dateTo ?? null}
      search={searchParams.search ?? null}
    />
  );
};

export default Screenings;
