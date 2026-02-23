import { ICity, ICityDetails } from "@/interfaces/ICities";
import { apiFetch } from "./client";

export const getCities = async (): Promise<ICity[]> => {
  try {
    const cities = await apiFetch<ICity[]>("/cities");
    return cities;
  } catch (error) {
    console.warn("Falling back to empty cities list:", error);
    return [];
  }
};

export const getCityById = async (id: number): Promise<ICityDetails> => {
  const city = await apiFetch<ICityDetails>(`/cities/${id}`);
  return city;
};

export const getCityBySlug = async (slug: string): Promise<ICityDetails> => {
  const city = await apiFetch<ICityDetails>(`/cities/${slug}`);
  return city;
};
