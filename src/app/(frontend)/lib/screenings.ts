import {
  IScreening,
  IScreeningGroup,
  IRandomScreening,
} from "@/interfaces/IScreenings";
import { PaginatedResponse } from "@/interfaces/IMovies";
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

export const getRandomScreening = async (): Promise<IRandomScreening> => {
  const screening = await apiFetch<IRandomScreening>(
    "/screenings/random-screening"
  );

  if (!screening) {
    throw new Error("No screening found");
  }

  return screening;
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
