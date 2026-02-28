import { IGenre } from "@/interfaces/IMovies";
import { apiFetch } from "./client";

export const getGenres = async (): Promise<IGenre[]> => {
  try {
    const genres = await apiFetch<IGenre[]>("/genres");
    return genres;
  } catch (error) {
    console.warn("Falling back to empty genres list:", error);
    return [];
  }
};

export const getGenreBySlug = async (slug: string): Promise<IGenre> => {
  const genre = await apiFetch<IGenre>(`/genres/${slug}`);
  return genre;
};
