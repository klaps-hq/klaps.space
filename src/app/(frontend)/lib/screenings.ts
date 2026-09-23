import {
  IScreening,
  IScreeningGroup,
  IRandomScreening,
  IRecentScreening,
} from "@/interfaces/IScreenings";
import { IMovie, PaginatedResponse } from "@/interfaces/IMovies";
import { apiFetch } from "./client";

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

export const getScreenings = async (
  params: GetScreeningsParams = {}
): Promise<IScreeningGroup[]> => {
  try {
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
      },
    });

    return Array.isArray(response) ? response : [...response.data];
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

  return Array.isArray(response) ? response : [...response.data];
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

    return response;
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
}

/** Look-back window of the "Ostatnio w repertuarze" section, in days. */
export const RECENT_SCREENINGS_DAYS = 90;

/**
 * Films screened in a cinema or city during the last RECENT_SCREENINGS_DAYS
 * days and no longer scheduled there, newest first.
 *
 * Returns an empty list on any failure so the section simply does not
 * render - including during `next build`, which has no API, and on an API
 * deployment that predates the endpoint.
 */
export const getRecentScreenings = async (
  params: GetRecentScreeningsParams
): Promise<IRecentScreening[]> => {
  try {
    return await apiFetch<IRecentScreening[]>("/screenings/recent", {
      params: {
        cinemaId: params.cinemaId ?? "",
        cityId: params.cityId ?? "",
        days: String(params.days ?? RECENT_SCREENINGS_DAYS),
        limit: params.limit ? params.limit.toString() : "",
      },
    });
  } catch (error) {
    console.warn("Falling back to empty recent screenings list:", error);
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
    const pool = (await getScreenings()).slice(0, HERO_POOL_SIZE);
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
      const screening = group.screenings[0];
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
