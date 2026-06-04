import { permanentRedirect } from "next/navigation";
import { ICity, ICityDetails } from "@/interfaces/ICities";
import { ICinemaGroup } from "@/interfaces/ICinema";
import { IScreeningGroup } from "@/interfaces/IScreenings";
import { apiFetch, fetchOrNotFound } from "./client";
import { getCinemas } from "./cinemas";

export const getCities = async (): Promise<ICity[]> => {
  try {
    // Awaited in the root layout on every page — cache aggressively
    // so it never becomes a TTFB bottleneck.
    const cities = await apiFetch<ICity[]>("/cities", {
      next: { revalidate: 3600 },
    });
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
  // fetchOrNotFound: an unknown slug must yield a 404, not a 500
  // (this is called directly from generateMetadata).
  return fetchOrNotFound(() => apiFetch<ICityDetails>(`/cities/${slug}`));
};

export const getCityPageData = async (
  slug: string
): Promise<{
  city: ICity;
  cinemaGroups: ICinemaGroup[];
  screenings: IScreeningGroup[];
}> => {
  return fetchOrNotFound(async () => {
    const cityData = await getCityBySlug(slug);

    if (cityData.city.slug !== slug) {
      permanentRedirect(`/miasta/${cityData.city.slug}`);
    }

    const cinemasResponse = await getCinemas({
      cityId: cityData.city.id.toString(),
    });

    const rawScreenings = cityData.screenings;
    const screenings = Array.isArray(rawScreenings)
      ? rawScreenings
      : [...(rawScreenings?.data ?? [])];

    return {
      city: cityData.city,
      cinemaGroups: cinemasResponse.data,
      screenings,
    };
  });
};
