import { permanentRedirect } from "next/navigation";
import {
  IMovie,
  IMovieSummary,
  IMultiCityMovie,
  PaginatedResponse,
} from "@/interfaces/IMovies";
import { IScreening } from "@/interfaces/IScreenings";
import { apiFetch, fetchOrNotFound } from "./client";
import { getMovieScreenings } from "./screenings";
import { getPreferredCityId } from "./get-preferred-city";

interface GetMoviesParams {
  page?: number;
  limit?: number;
  search?: string | null;
  genreId?: string | null;
}

export const getMultiCityMovies = async (): Promise<IMultiCityMovie[]> => {
  try {
    const movies = await apiFetch<IMultiCityMovie[]>("/movies/multi-city");
    return movies;
  } catch (error) {
    console.warn("Falling back to empty multi-city movies list:", error);
    return [];
  }
};

export const getMovies = async (
  params: GetMoviesParams = {}
): Promise<PaginatedResponse<IMovieSummary>> => {
  try {
    const response = await apiFetch<PaginatedResponse<IMovieSummary>>("/movies", {
      params: {
        page: (params.page ?? 1).toString(),
        limit: (params.limit ?? 20).toString(),
        search: params.search ?? "",
        genreId: params.genreId ?? "",
      },
    });
    return response;
  } catch (error) {
    console.warn("Falling back to empty movies list:", error);
    return {
      data: [],
      meta: {
        total: 0,
        page: params.page ?? 1,
        limit: params.limit ?? 20,
        totalPages: 0,
      },
    };
  }
};

export const getMovieById = async (id: number): Promise<IMovie> => {
  const movie = await apiFetch<IMovie>(`/movies/${id}`);
  return movie;
};

export const getMovieBySlug = async (slug: string): Promise<IMovie> => {
  const movie = await apiFetch<IMovie>(`/movies/${slug}`);
  return movie;
};

export const getMoviePageData = async (
  slug: string
): Promise<{ movie: IMovie; screenings: IScreening[] }> => {
  return fetchOrNotFound(async () => {
    const movie = await getMovieBySlug(slug);

    if (movie.slug !== slug) {
      permanentRedirect(`/filmy/${movie.slug}`);
    }

    const cityId = await getPreferredCityId();
    const screenings = await getMovieScreenings({
      movieId: movie.id.toString(),
      cityId,
    });

    return { movie, screenings };
  });
};
