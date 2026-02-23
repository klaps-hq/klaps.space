import {
  IMovie,
  IMovieSummary,
  IMultiCityMovie,
  PaginatedResponse,
} from "@/interfaces/IMovies";
import { apiFetch } from "./client";

interface GetMultiCityMoviesParams {
  limit?: number;
}

interface GetMoviesParams {
  page?: number;
  limit?: number;
  search?: string | null;
  genreId?: string | null;
}

export const getMultiCityMovies = async (
  params: GetMultiCityMoviesParams = {}
): Promise<IMultiCityMovie[]> => {
  const movies = await apiFetch<IMultiCityMovie[]>("/movies/multi-city", {
    params: {
      limit: params.limit?.toString() ?? "100",
    },
  });
  return movies;
};

export const getMovies = async (
  params: GetMoviesParams = {}
): Promise<PaginatedResponse<IMovieSummary>> => {
  const response = await apiFetch<PaginatedResponse<IMovieSummary>>("/movies", {
    params: {
      page: (params.page ?? 1).toString(),
      limit: (params.limit ?? 20).toString(),
      search: params.search ?? "",
      genreId: params.genreId ?? "",
    },
  });
  return response;
};

export const getMovieById = async (id: number): Promise<IMovie> => {
  const movie = await apiFetch<IMovie>(`/movies/${id}`);
  return movie;
};

export const getMovieBySlug = async (slug: string): Promise<IMovie> => {
  const movie = await apiFetch<IMovie>(`/movies/${slug}`);
  return movie;
};
