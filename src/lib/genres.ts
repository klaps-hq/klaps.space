import { IGenre } from "@/interfaces/IMovies";
import { apiFetch, apiFetchWithFallback } from "./client";

export const getGenres = async (): Promise<IGenre[]> => {
  const genres = await apiFetch<IGenre[]>("/genres");
  return genres;
};

export const getGenreBySlug = async (slug: string): Promise<IGenre> => {
  const genre = await apiFetchWithFallback<IGenre>([
    `/genres/${slug}`,
    `/genres/by-slug/${slug}`,
    `/genres/slug/${slug}`,
  ]);
  return genre;
};
