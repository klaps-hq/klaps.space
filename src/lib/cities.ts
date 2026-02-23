import { ICity, ICityDetails } from "@/interfaces/ICities";
import { apiFetch, apiFetchWithFallback } from "./client";

export const getCities = async (): Promise<ICity[]> => {
  const cities = await apiFetch<ICity[]>("/cities");
  return cities;
};

export const getCityById = async (id: number): Promise<ICityDetails> => {
  const city = await apiFetch<ICityDetails>(`/cities/${id}`);
  return city;
};

export const getCityBySlug = async (slug: string): Promise<ICityDetails> => {
  const city = await apiFetchWithFallback<ICityDetails>([
    `/cities/${slug}`,
    `/cities/by-slug/${slug}`,
    `/cities/slug/${slug}`,
  ]);
  return city;
};
