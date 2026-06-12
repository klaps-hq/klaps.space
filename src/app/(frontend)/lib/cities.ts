import { ICity, ICityDetails } from "@/interfaces/ICities";
import { apiFetch, fetchOrNotFound } from "./client";

export const getCities = async (): Promise<ICity[]> => {
  try {
    // Awaited in the root layout on every page - cache aggressively
    // so it never becomes a TTFB bottleneck. The with-cinemas endpoint
    // returns only cities that actually have cinemas, each with
    // numberOfCinemas and voivodeship filled in.
    const cities = await apiFetch<ICity[]>("/cities/with-cinemas", {
      next: { revalidate: 3600 },
    });
    // Postgres count() comes through the API as a string - coerce so
    // arithmetic on numberOfCinemas does not silently concatenate.
    return cities.map((city) => ({
      ...city,
      numberOfCinemas: Number(city.numberOfCinemas),
    }));
  } catch (error) {
    console.warn("Falling back to empty cities list:", error);
    return [];
  }
};

export const getCityBySlug = async (slug: string): Promise<ICityDetails> => {
  // fetchOrNotFound: an unknown slug must yield a 404, not a 500
  // (this is called directly from generateMetadata).
  return fetchOrNotFound(() => apiFetch<ICityDetails>(`/cities/${slug}`));
};
