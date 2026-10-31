import { IScreeningGroup } from "@/interfaces/IScreenings";
import { IGenre, IMovieSummary } from "@/interfaces/IMovies";
import { ScreeningGroupFilters } from "./screening-filters";
import { wallTimeToInstant } from "./warsaw-time";

// Screening groups cross into client components (cards, filter islands) and
// are serialized into the RSC payload of every listing. Shipping whole
// screenings, each with its own copy of the cinema and city, made
// /gatunki/dramat weigh 2 MB of HTML, 1.7 MB of it flight data for 3808
// screenings (October 2026). The repertoire below carries only what the
// client renders or filters on: screenings as tuples, each city once.

/** Movie fields a screening card renders and the filters match on. */
export interface IRepertoireMovie
  extends Pick<
    IMovieSummary,
    "id" | "slug" | "title" | "titleOriginal" | "productionYear" | "posterUrl"
  > {
  genres: Pick<IGenre, "id" | "name">[];
}

/** A screening as the client holds it: wall-clock dateTime and city id. */
export type IRepertoireScreening = [dateTime: string, cityId: number];

export interface IRepertoireCity {
  id: number;
  name: string;
  voivodeship: string | null;
}

/**
 * One movie of a listing. Every screening is kept, in API order (grouped by
 * cinema, not by time): cards show the first two that have not started and
 * count the rest, and filters may keep any of them.
 */
export interface IRepertoireGroup {
  movie: IRepertoireMovie;
  screenings: IRepertoireScreening[];
}

export interface IRepertoire {
  cities: IRepertoireCity[];
  groups: IRepertoireGroup[];
}

const toRepertoireMovie = (movie: IMovieSummary): IRepertoireMovie => ({
  id: movie.id,
  slug: movie.slug,
  title: movie.title,
  titleOriginal: movie.titleOriginal,
  productionYear: movie.productionYear,
  posterUrl: movie.posterUrl,
  genres: movie.genres.map(({ id, name }) => ({ id, name })),
});

const buildRepertoire = (groups: IScreeningGroup[]): IRepertoire => {
  const cities = new Map<number, IRepertoireCity>();
  const repertoireGroups = groups.map((group) => ({
    movie: toRepertoireMovie(group.movie),
    screenings: group.screenings.map((screening): IRepertoireScreening => {
      const { city } = screening.cinema;
      if (!cities.has(city.id)) {
        cities.set(city.id, {
          id: city.id,
          name: city.name,
          voivodeship: city.voivodeship,
        });
      }
      return [screening.dateTime, city.id];
    }),
  }));
  return { cities: [...cities.values()], groups: repertoireGroups };
};

// Memoized per input array: listings pass the same groups to the filter
// island and to the card grid, and React serializes an object shared by
// both only once. Two separate conversions shipped every screening twice.
const repertoireCache = new WeakMap<IScreeningGroup[], IRepertoire>();

export const toRepertoire = (groups: IScreeningGroup[]): IRepertoire => {
  const cached = repertoireCache.get(groups);
  if (cached) return cached;
  const repertoire = buildRepertoire(groups);
  repertoireCache.set(groups, repertoire);
  return repertoire;
};

/**
 * The group without showtimes that already started, or null when none is
 * left. Returns the same object when nothing was dropped, so memoized
 * consumers do not re-render.
 */
export const upcomingRepertoireGroup = (
  group: IRepertoireGroup,
  now: number
): IRepertoireGroup | null => {
  const screenings = group.screenings.filter(
    ([dateTime]) => wallTimeToInstant(dateTime).getTime() > now
  );
  if (screenings.length === group.screenings.length) return group;
  if (screenings.length === 0) return null;
  return { ...group, screenings };
};

/** Wall-clock "YYYY-MM-DD" of a screening dateTime. */
export const screeningDate = (dateTime: string): string =>
  dateTime.slice(0, 10);

/** Wall-clock "HH:MM" of a screening dateTime. */
export const screeningTime = (dateTime: string): string =>
  dateTime.slice(11, 16);

/**
 * Client-side filtering of a listing that is statically cached (ISR) with
 * its full repertoire. Genre and search match the movie; city, voivodeship
 * and date range narrow its screenings, and movies left with none drop out.
 */
export const filterRepertoire = (
  repertoire: IRepertoire,
  filters: ScreeningGroupFilters
): IRepertoire => {
  const voivodeshipByCity = new Map(
    repertoire.cities.map((city) => [city.id, city.voivodeship])
  );
  const genreIds = filters.genreIds ?? [];
  const search = filters.search?.trim().toLowerCase() ?? "";
  const { cityId, voivodeship, dateFrom, dateTo } = filters;

  const groups = repertoire.groups.flatMap((group) => {
    const { movie } = group;
    if (
      genreIds.length > 0 &&
      !movie.genres.some((genre) => genreIds.includes(genre.id))
    ) {
      return [];
    }
    if (search) {
      const haystack = [movie.title, movie.titleOriginal]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(search)) return [];
    }

    // Dates are ISO "YYYY-MM-DD" strings, safe to compare lexically.
    const screenings = group.screenings.filter(([dateTime, screeningCityId]) => {
      const date = screeningDate(dateTime);
      return (
        (cityId == null || screeningCityId === cityId) &&
        (voivodeship == null ||
          voivodeshipByCity.get(screeningCityId) === voivodeship) &&
        (!dateFrom || date >= dateFrom) &&
        (!dateTo || date <= dateTo)
      );
    });
    if (screenings.length === 0) return [];
    return screenings.length === group.screenings.length
      ? group
      : { movie, screenings };
  });

  return { cities: repertoire.cities, groups };
};
