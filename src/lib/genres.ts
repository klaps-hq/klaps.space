import { IGenre } from "@/interfaces/IMovies";
import { apiFetch } from "./client";

export const getGenres = async (): Promise<IGenre[]> => {
  const genres = await apiFetch<IGenre[]>("/genres");
  return genres;
};

export const getGenreBySlug = async (slug: string): Promise<IGenre> => {
  const genre = await apiFetch<IGenre>(`/genres/${slug}`);
  return genre;
};
