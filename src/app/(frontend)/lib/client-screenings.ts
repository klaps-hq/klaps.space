import { IScreeningGroup } from "@/interfaces/IScreenings";
import { IGenre, IMovieSummary } from "@/interfaces/IMovies";
import { isChainCinema } from "./cinema-chains";
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
  /**
   * Set when the movie page is noindex (isMovieIndexable, e.g. a
   * multiplex-only reissue): the card then links through UncrawledLink.
   * One boolean per card instead of the indexable slug set, which would
   * weigh more than the listing itself. Absent means a regular link.
   */
  noindex?: true;
}

/**
 * A screening as the client holds it: wall-clock dateTime, city id and, only
 * for a chain multiplex, a trailing 1. Independents leave it out, so the
 * flag behind the "kino sieciowe" label and the "Tylko kina studyjne"
 * filter costs nothing on most screenings.
 */
export type IRepertoireScreening = [dateTime: string, cityId: number, chain?: 1];

export const isChainRepertoireScreening = (
  screening: IRepertoireScreening
): boolean => screening[2] === 1;

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

const toRepertoireMovie = (
  movie: IMovieSummary,
  indexableMovies: ReadonlySet<string> | null
): IRepertoireMovie => ({
  id: movie.id,
  slug: movie.slug,
  title: movie.title,
  titleOriginal: movie.titleOriginal,
  productionYear: movie.productionYear,
  posterUrl: movie.posterUrl,
  genres: movie.genres.map(({ id, name }) => ({ id, name })),
  ...(indexableMovies && !indexableMovies.has(movie.slug)
    ? { noindex: true as const }
    : {}),
});

const buildRepertoire = (
  groups: IScreeningGroup[],
  indexableMovies: ReadonlySet<string> | null
): IRepertoire => {
  const cities = new Map<number, IRepertoireCity>();
  const repertoireGroups = groups.map((group) => ({
    movie: toRepertoireMovie(group.movie, indexableMovies),
    screenings: group.screenings.map((screening): IRepertoireScreening => {
      const { city } = screening.cinema;
      if (!cities.has(city.id)) {
        cities.set(city.id, {
          id: city.id,
          name: city.name,
          voivodeship: city.voivodeship,
        });
      }
      return isChainCinema(screening.cinema.name)
        ? [screening.dateTime, city.id, 1]
        : [screening.dateTime, city.id];
    }),
  }));
  return { cities: [...cities.values()], groups: repertoireGroups };
};

// Memoized per input array: listings pass the same groups to the filter
// island and to the card grid, and React serializes an object shared by
// both only once. Two separate conversions shipped every screening twice.
// The indexable set is part of the key; getIndexableSlugs is request-cached,
// so both callers of one render pass the same Set instance.
const repertoireCache = new WeakMap<
  IScreeningGroup[],
  { indexableMovies: ReadonlySet<string> | null; repertoire: IRepertoire }
>();

/**
 * @param indexableMovies Movie slugs with an indexable page
 * (IndexableSlugs.movies). Movies outside it are flagged `noindex`. Omit or
 * pass null to link every movie (unknown list, or a client-side refetch).
 */
export const toRepertoire = (
  groups: IScreeningGroup[],
  indexableMovies: ReadonlySet<string> | null = null
): IRepertoire => {
  const cached = repertoireCache.get(groups);
  if (cached && cached.indexableMovies === indexableMovies) {
    return cached.repertoire;
  }
  const repertoire = buildRepertoire(groups, indexableMovies);
  repertoireCache.set(groups, { indexableMovies, repertoire });
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
 * its full repertoire. Genre and search match the movie; city, voivodeship,
 * date range and the independents-only switch narrow its screenings, and
 * movies left with none drop out.
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
  const { cityId, voivodeship, dateFrom, dateTo, independentOnly } = filters;

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
    const screenings = group.screenings.filter((screening) => {
      const [dateTime, screeningCityId] = screening;
      const date = screeningDate(dateTime);
      return (
        (cityId == null || screeningCityId === cityId) &&
        (voivodeship == null ||
          voivodeshipByCity.get(screeningCityId) === voivodeship) &&
        (!dateFrom || date >= dateFrom) &&
        (!dateTo || date <= dateTo) &&
        (!independentOnly || !isChainRepertoireScreening(screening))
      );
    });
    if (screenings.length === 0) return [];
    return screenings.length === group.screenings.length
      ? group
      : { movie, screenings };
  });

  return { cities: repertoire.cities, groups };
};
