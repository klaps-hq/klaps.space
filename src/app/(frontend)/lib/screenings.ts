import {
  IScreening,
  IScreeningGroup,
  IRandomScreening,
  IRecentScreening,
  IRecentVenue,
} from "@/interfaces/IScreenings";
import { IGenre, IMovie, PaginatedResponse } from "@/interfaces/IMovies";
import { ICinemaSummary } from "@/interfaces/ICinema";
import { apiFetch } from "./client";
import { dropPastScreeningGroups, dropPastScreenings } from "./screening-filters";
import { isChainCinema } from "./cinema-chains";

// The API embeds whole movie, genre, cinema and city records in every
// screening: descriptions, ticket URLs, population. One popular film carried
// 161 copies of the Warsaw city guide, and these groups are serialized into
// the RSC payload of every listing (430 KB of the 705 KB homepage), where
// hydrating them cost ~850 ms of main-thread time on mobile. Only the fields
// the interfaces declare are kept; descriptions are nulled because listings
// never render them (entity pages read their own endpoints).
const slimGenre = ({ id, slug, name }: IGenre): IGenre => ({
  id,
  slug,
  name,
  description: null,
});

const slimCinema = (cinema: ICinemaSummary): ICinemaSummary => ({
  id: cinema.id,
  slug: cinema.slug,
  name: cinema.name,
  street: cinema.street,
  city: {
    id: cinema.city.id,
    slug: cinema.city.slug,
    name: cinema.city.name,
    nameDeclinated: cinema.city.nameDeclinated,
    numberOfCinemas: cinema.city.numberOfCinemas,
    description: null,
    voivodeship: cinema.city.voivodeship,
  },
  latitude: cinema.latitude,
  longitude: cinema.longitude,
  updatedAt: cinema.updatedAt,
  isOpenAir: cinema.isOpenAir,
});

const slimScreening = (screening: IScreening): IScreening => ({
  id: screening.id,
  date: screening.date,
  time: screening.time,
  dateTime: screening.dateTime,
  isDubbing: screening.isDubbing,
  isSubtitled: screening.isSubtitled,
  cinema: slimCinema(screening.cinema),
});

const slimScreeningGroup = ({
  movie,
  summary,
  screenings,
}: IScreeningGroup): IScreeningGroup => ({
  movie: {
    id: movie.id,
    slug: movie.slug,
    title: movie.title,
    titleOriginal: movie.titleOriginal,
    productionYear: movie.productionYear,
    duration: movie.duration,
    posterUrl: movie.posterUrl,
    genres: movie.genres.map(slimGenre),
    updatedAt: movie.updatedAt,
  },
  summary,
  screenings: screenings.map(slimScreening),
});

const isIndependentScreening = (screening: IScreening): boolean =>
  !isChainCinema(screening.cinema.name);

/**
 * Films shown in at least one independent venue lead, chain-only films
 * follow, each part keeping the API's date order. Content audit, October
 * 2026: in date order the homepage opened with a Halloween re-release
 * playing in 190 multiplexes and the hero with a Helios showtime, so the
 * site read as a multiplex aggregator rather than an arthouse guide. Chain
 * screenings stay listed, just not first.
 */
const independentFirst = (groups: IScreeningGroup[]): IScreeningGroup[] => [
  ...groups.filter((group) => group.screenings.some(isIndependentScreening)),
  ...groups.filter((group) => !group.screenings.some(isIndependentScreening)),
];

const prepareGroups = (groups: IScreeningGroup[]): IScreeningGroup[] =>
  independentFirst(dropPastScreeningGroups(groups).map(slimScreeningGroup));

interface GetScreeningsParams {
  cityId?: string | null;
  // The API prioritizes city over voivodeship - callers send one of them.
  voivodeship?: string | null;
  cinemaId?: string | null;
  genreId?: string | null;
  dateFrom?: string | null;
  dateTo?: string | null;
  search?: string | null;
  limit?: number | null;
  citySlug?: string | null;
  // Landing page filters (/kino-plenerowe, /klasyka-w-kinach).
  openAir?: boolean;
  classic?: boolean;
}

interface GetPaginatedScreeningsParams extends GetScreeningsParams {
  page?: number;
}

interface GetMovieScreeningsParams {
  movieId: string;
  cityId?: string | null;
}

interface GetLastUpdatedParams {
  cityId?: string | null;
  voivodeship?: string | null;
  citySlug?: string | null;
  cinemaId?: string | null;
  cinemaSlug?: string | null;
}

/**
 * Upcoming screening groups. Throws on failure, for callers where an empty
 * list drives a decision (see fetchRecentScreenings); same URL as
 * getScreenings, so the two share one cached fetch.
 *
 * Every screenings call below drops showtimes that already started: the API
 * range begins at midnight, so without this a page rendered at 18:00 would
 * still list the 10:00 screening of the same day.
 */
export const fetchScreenings = async (
  params: GetScreeningsParams = {}
): Promise<IScreeningGroup[]> => {
  const response = await apiFetch<
    IScreeningGroup[] | PaginatedResponse<IScreeningGroup>
  >("/screenings", {
    params: {
      cityId: params.cityId ?? "",
      voivodeship: params.voivodeship ?? "",
      cinemaId: params.cinemaId ?? "",
      genreId: params.genreId ?? "",
      dateFrom: params.dateFrom ?? "",
      dateTo: params.dateTo ?? "",
      search: params.search ?? "",
      limit: params.limit ? params.limit.toString() : "",
      citySlug: params.citySlug ?? "",
      openAir: params.openAir ? "true" : "",
      classic: params.classic ? "true" : "",
    },
  });

  return prepareGroups(
    Array.isArray(response) ? response : [...response.data]
  );
};

export const getScreenings = async (
  params: GetScreeningsParams = {}
): Promise<IScreeningGroup[]> => {
  try {
    return await fetchScreenings(params);
  } catch (error) {
    console.warn("Falling back to empty screenings list:", error);
    return [];
  }
};

export const getMovieScreenings = async (
  params: GetMovieScreeningsParams
): Promise<IScreening[]> => {
  const response = await apiFetch<IScreening[] | PaginatedResponse<IScreening>>(
    "/screenings",
    {
      params: {
        movieId: params.movieId,
        cityId: params.cityId ?? "",
      },
    }
  );

  return dropPastScreenings(
    Array.isArray(response) ? response : [...response.data]
  ).map(slimScreening);
};

export const getPaginatedScreenings = async (
  params: GetPaginatedScreeningsParams = {}
): Promise<PaginatedResponse<IScreeningGroup> | IScreeningGroup[]> => {
  try {
    const response = await apiFetch<
      PaginatedResponse<IScreeningGroup> | IScreeningGroup[]
    >("/screenings", {
      params: {
        cityId: params.cityId ?? "",
        voivodeship: params.voivodeship ?? "",
        cinemaId: params.cinemaId ?? "",
        genreId: params.genreId ?? "",
        dateFrom: params.dateFrom ?? "",
        dateTo: params.dateTo ?? "",
        search: params.search ?? "",
        limit: params.limit ? params.limit.toString() : "",
        page: params.page ? params.page.toString() : "",
      },
    });

    if (Array.isArray(response)) return prepareGroups(response);
    return { ...response, data: prepareGroups([...response.data]) };
  } catch (error) {
    console.warn("Falling back to empty paginated screenings list:", error);
    return {
      data: [],
      meta: {
        total: 0,
        page: params.page ?? 1,
        limit: 24,
        totalPages: 0,
      },
    };
  }
};

/**
 * Newest screening `updatedAt` for the (optionally location-filtered) set,
 * i.e. when repertoire data was last added. Backs the visible
 * "Repertuar zaktualizowano" label and JSON-LD dateModified.
 * Returns null when nothing matches or the request fails.
 */
export const getScreeningsLastUpdated = async (
  params: GetLastUpdatedParams = {}
): Promise<Date | null> => {
  try {
    const response = await apiFetch<{ updatedAt: string | null }>(
      "/screenings/last-updated",
      {
        params: {
          cityId: params.cityId ?? "",
          voivodeship: params.voivodeship ?? "",
          citySlug: params.citySlug ?? "",
          cinemaId: params.cinemaId ?? "",
          cinemaSlug: params.cinemaSlug ?? "",
        },
      }
    );

    return response.updatedAt ? new Date(response.updatedAt) : null;
  } catch (error) {
    console.warn("Falling back to null screenings last-updated:", error);
    return null;
  }
};

interface GetRecentScreeningsParams {
  cinemaId?: string | null;
  cityId?: string | null;
  days?: number;
  limit?: number;
  openAir?: boolean;
}

/** Look-back window of the "Ostatnio w repertuarze" section, in days. */
export const RECENT_SCREENINGS_DAYS = 90;

/**
 * Films screened in a cinema or city during the last RECENT_SCREENINGS_DAYS
 * days and no longer scheduled there, newest first. Throws on failure.
 *
 * Use this where an empty list drives a decision, such as `noindex`: a
 * failed call must not read as "nothing screened here". Same URL as
 * getRecentScreenings, so the two share one cached fetch.
 */
export const fetchRecentScreenings = (
  params: GetRecentScreeningsParams
): Promise<IRecentScreening[]> =>
  apiFetch<IRecentScreening[]>("/screenings/recent", {
    params: {
      cinemaId: params.cinemaId ?? "",
      cityId: params.cityId ?? "",
      days: String(params.days ?? RECENT_SCREENINGS_DAYS),
      limit: params.limit ? params.limit.toString() : "",
      openAir: params.openAir ? "true" : "",
    },
  });

/**
 * fetchRecentScreenings for rendering: returns an empty list on any failure
 * so the section simply does not render - including during `next build`,
 * which has no API, and on an API deployment that predates the endpoint.
 */
export const getRecentScreenings = async (
  params: GetRecentScreeningsParams
): Promise<IRecentScreening[]> => {
  try {
    return await fetchRecentScreenings(params);
  } catch (error) {
    console.warn("Falling back to empty recent screenings list:", error);
    return [];
  }
};

/**
 * Cinemas where a film played during the last RECENT_SCREENINGS_DAYS days,
 * newest first. Keeps a movie page indexable between screening runs.
 *
 * Returns an empty list on any failure, which means "noindex" for a movie
 * without upcoming screenings: the behaviour from before this list existed,
 * and the safe one on an API deployment that predates the endpoint.
 */
export const getRecentVenues = async (
  movieId: number
): Promise<IRecentVenue[]> => {
  try {
    return await apiFetch<IRecentVenue[]>("/screenings/recent-venues", {
      params: {
        movieId: movieId.toString(),
        days: String(RECENT_SCREENINGS_DAYS),
      },
    });
  } catch (error) {
    console.warn("Falling back to empty recent venues list:", error);
    return [];
  }
};

// Default screening groups shown on the homepage before any filter is
// applied. Matches what /api/screenings returns for an empty query so the
// server-rendered first screen and any client refetch stay identical.
export const HOME_SCREENINGS_LIMIT = 30;

interface HomeScreeningsFilters {
  cityId?: string;
  // The API prioritizes city over voivodeship - pass at most one.
  voivodeship?: string;
  // Already-validated numeric id strings.
  genreIds?: string[];
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface HomeScreeningsResult {
  screenings: IScreeningGroup[];
  hasMore: boolean;
}

const unwrapScreeningsResponse = (
  response: IScreeningGroup[] | PaginatedResponse<IScreeningGroup>
): IScreeningGroup[] =>
  Array.isArray(response) ? response : [...response.data];

// Multi-genre selection: the upstream API accepts a single genreId, so we
// fetch per genre and dedupe by movie, keeping the first occurrence.
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

/**
 * The homepage screenings grid (default and filtered). Shared by the
 * server-rendered initial render and the /api/screenings client refetch so
 * both always produce the same set; the default (no filters) variant is
 * baked into the statically cached homepage HTML.
 */
export const fetchHomeScreenings = async (
  filters: HomeScreeningsFilters = {}
): Promise<HomeScreeningsResult> => {
  const {
    cityId,
    voivodeship,
    genreIds = [],
    dateFrom,
    dateTo,
    search,
  } = filters;
  const sharedFilters = { cityId, voivodeship, dateFrom, dateTo, search };

  const allScreenings =
    genreIds.length > 1
      ? await Promise.all(
          genreIds.map((id) =>
            getPaginatedScreenings({ ...sharedFilters, genreId: id }).then(
              unwrapScreeningsResponse
            )
          )
        ).then(mergeScreeningGroups)
      : await getPaginatedScreenings({
          ...sharedFilters,
          genreId: genreIds[0],
        }).then(unwrapScreeningsResponse);

  const screenings = allScreenings.slice(0, HOME_SCREENINGS_LIMIT);
  return {
    screenings,
    hasMore: allScreenings.length > screenings.length,
  };
};

// Home hero rotates only across this many upcoming screenings. A fully
// random backdrop on every revalidation would force the image optimizer to
// re-encode a cold (and, for big originals, slow) variant each time; a small
// stable pool keeps those few variants warm in the optimizer cache instead.
const HERO_POOL_SIZE = 10;
const HERO_ROTATION_WINDOW_MS = 5 * 60 * 1000;

/**
 * Featured screening for the home hero, picked from a small stable pool of
 * upcoming screenings instead of a fully random one (see HERO_POOL_SIZE).
 * Returns null when the pool is empty or the movie detail fetch fails, in
 * which case the hero falls back to its generic variant.
 */
export const getFeaturedHeroScreening =
  async (): Promise<IRandomScreening | null> => {
    // Only films with an independent screening qualify: the hero is the
    // site's first impression and used to feature multiplex showtimes.
    const pool = (await getScreenings())
      .filter((group) => group.screenings.some(isIndependentScreening))
      .slice(0, HERO_POOL_SIZE);
    if (pool.length === 0) {
      return null;
    }

    // Deterministic per revalidation window: the homepage is ISR, so this
    // runs at build/revalidation only (never per request), and stepping the
    // index by the same ~5 min cadence as `revalidate` walks the pool one
    // backdrop at a time.
    const startIndex =
      Math.floor(Date.now() / HERO_ROTATION_WINDOW_MS) % pool.length;

    // Walk the pool from the rotation index and take the first candidate the
    // hero can actually render. Picking blind meant that whenever rotation
    // landed on a movie without a backdrop or description - common, since the
    // pool is just the next screenings, not curated - the hero silently
    // dropped to its flat fallback with no image at all.
    for (let step = 0; step < pool.length; step += 1) {
      const group = pool[(startIndex + step) % pool.length];
      const screening = group.screenings.find(isIndependentScreening);
      if (!screening) continue;

      try {
        // Direct apiFetch (not getMovieBySlug) to avoid a screenings <-> movies
        // import cycle and the notFound() control-flow; the pool only holds
        // movies that already have screenings, so this fetch normally succeeds.
        const movie = await apiFetch<IMovie>(`/movies/${group.movie.slug}`);

        // Same bar the hero itself applies, checked here so a miss moves to
        // the next candidate instead of losing the backdrop for the whole
        // revalidation window.
        if (!movie.description?.trim() || !movie.backdropUrl) continue;

        return {
          movie: {
            id: movie.id,
            slug: movie.slug,
            title: movie.title,
            titleOriginal: movie.titleOriginal,
            productionYear: movie.productionYear,
            duration: movie.duration,
            posterUrl: movie.posterUrl,
            genres: movie.genres,
            description: movie.description,
            backdropUrl: movie.backdropUrl,
            posterBlurDataUrl: movie.posterBlurDataUrl,
            backdropBlurDataUrl: movie.backdropBlurDataUrl,
            videoUrl: movie.videoUrl,
            directors: movie.directors,
          },
          screening,
        };
      } catch {
        continue;
      }
    }

    // Nothing in the pool has a usable backdrop; the hero falls back.
    return null;
  };

export const groupScreeningsByCinema = (
  screenings: IScreening[]
): IScreening[][] => {
  const grouped = new Map<number, IScreening[]>();

  for (const screening of screenings) {
    const existing = grouped.get(screening.cinema.id) ?? [];
    existing.push(screening);
    grouped.set(screening.cinema.id, existing);
  }

  return Array.from(grouped.values());
};
