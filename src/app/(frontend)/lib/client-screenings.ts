import { IScreeningGroup } from "@/interfaces/IScreenings";
import { IGenre, IMovieSummary } from "@/interfaces/IMovies";
import { ScreeningGroupFilters } from "./screening-filters";
import { wallTimeToInstant } from "./warsaw-time";

// Screening groups cross into client components (cards, filter islands) and
// are serialized into the RSC payload of every listing. Shipping whole
// screenings, each with its own copy of the cinema and city, made
// /gatunki/dramat weigh 2 MB of HTML, 1.7 MB of it flight data for 3808
// screenings (October 2026). The shapes below carry only what the client
// renders or filters on, with screenings as tuples rather than objects.

/** Movie fields a screening card renders and the filters match on. */
export interface ICardMovie
  extends Pick<
    IMovieSummary,
    "id" | "slug" | "title" | "titleOriginal" | "productionYear" | "posterUrl"
  > {
  genres: Pick<IGenre, "id" | "name">[];
}

/** A showtime as a card holds it: wall-clock dateTime and the city name. */
export type ICardScreening = [dateTime: string, city: string];

/**
 * What a ScreeningCard needs. Every screening is kept, in API order (grouped
 * by cinema, not by time): the card shows the first two that have not
 * started and counts the rest, both of which change as showtimes pass.
 */
export interface ICardGroup {
  movie: ICardMovie;
  screenings: ICardScreening[];
}

const toCardMovie = (movie: IMovieSummary): ICardMovie => ({
  id: movie.id,
  slug: movie.slug,
  title: movie.title,
  titleOriginal: movie.titleOriginal,
  productionYear: movie.productionYear,
  posterUrl: movie.posterUrl,
  genres: movie.genres.map(({ id, name }) => ({ id, name })),
});

export const toCardGroup = (group: IScreeningGroup): ICardGroup => ({
  movie: toCardMovie(group.movie),
  screenings: group.screenings.map((screening) => [
    screening.dateTime,
    screening.cinema.city.name,
  ]),
});

/**
 * The card without showtimes that already started, or null when none is
 * left. Returns the same object when nothing was dropped, so memoized
 * consumers do not re-render.
 */
export const upcomingCardGroup = (
  group: ICardGroup,
  now: number
): ICardGroup | null => {
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

/** A screening as the filter island holds it: dateTime and city id. */
export type IFilterableScreening = [dateTime: string, cityId: number];

export interface IFilterableCity {
  id: number;
  name: string;
  voivodeship: string | null;
}

export interface IFilterableGroup {
  movie: ICardMovie;
  screenings: IFilterableScreening[];
}

/**
 * The full repertoire of a listing in the form its filter island needs:
 * every screening, with each city stored once instead of inside every
 * screening.
 */
export interface IFilterableRepertoire {
  cities: IFilterableCity[];
  groups: IFilterableGroup[];
}

export const toFilterableRepertoire = (
  groups: IScreeningGroup[]
): IFilterableRepertoire => {
  const cities = new Map<number, IFilterableCity>();
  const filterableGroups = groups.map((group) => ({
    movie: toCardMovie(group.movie),
    screenings: group.screenings.map((screening): IFilterableScreening => {
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
  return { cities: [...cities.values()], groups: filterableGroups };
};

/**
 * Client-side filtering of a listing that is statically cached (ISR) with
 * its full repertoire. Genre and search match the movie; city, voivodeship
 * and date range narrow its screenings, and movies left with none drop out.
 */
export const filterRepertoire = (
  { cities, groups }: IFilterableRepertoire,
  filters: ScreeningGroupFilters
): ICardGroup[] => {
  const cityById = new Map(cities.map((city) => [city.id, city]));
  const genreIds = filters.genreIds ?? [];
  const search = filters.search?.trim().toLowerCase() ?? "";
  const { cityId, voivodeship, dateFrom, dateTo } = filters;

  return groups.flatMap((group) => {
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
    const screenings = group.screenings.flatMap(
      ([dateTime, screeningCityId]): ICardScreening[] => {
        const date = screeningDate(dateTime);
        const city = cityById.get(screeningCityId);
        const matches =
          (cityId == null || screeningCityId === cityId) &&
          (voivodeship == null || city?.voivodeship === voivodeship) &&
          (!dateFrom || date >= dateFrom) &&
          (!dateTo || date <= dateTo);
        return matches ? [[dateTime, city?.name ?? ""]] : [];
      }
    );
    return screenings.length > 0 ? { movie, screenings } : [];
  });
};
