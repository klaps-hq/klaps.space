import { permanentRedirect } from "next/navigation";
import { IGenre } from "@/interfaces/IMovies";
import { apiFetch, fetchOrNotFound } from "./client";

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

export const getGenrePageData = async (
  slug: string
): Promise<IGenre> => {
  return fetchOrNotFound(async () => {
    const genre = await getGenreBySlug(slug);

    if (genre.slug !== slug) {
      permanentRedirect(`/gatunki/${genre.slug}`);
    }

    return genre;
  });
};
