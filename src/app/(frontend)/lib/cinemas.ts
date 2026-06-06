import { permanentRedirect } from "next/navigation";
import { ICinema, ICinemaGroup, ICinemaSummary } from "@/interfaces/ICinema";
import { IScreeningGroup } from "@/interfaces/IScreenings";
import { apiFetch, fetchOrNotFound } from "./client";
import { getScreenings } from "./screenings";

interface GetCinemasParams {
  cityId?: string | null;
  limit?: number;
}

function groupCinemasByCity(cinemas: ICinemaSummary[]): ICinemaGroup[] {
  const map = new Map<number, ICinemaGroup>();

  for (const cinema of cinemas) {
    const cityId = cinema.city.id;
    let group = map.get(cityId);
    if (!group) {
      group = { city: cinema.city, cinemas: [] };
      map.set(cityId, group);
    }
    const { city: _city, ...rest } = cinema;
    group.cinemas.push(rest);
  }

  return Array.from(map.values());
}

export const getCinemas = async (
  params: GetCinemasParams = {}
): Promise<{ data: ICinemaGroup[] }> => {
  try {
    const response = await apiFetch<
      ICinemaSummary[] | { data: ICinemaGroup[] }
    >("/cinemas", {
      params: {
        cityId: params.cityId ?? "",
        limit: params.limit?.toString() ?? "",
      },
    });

    if (Array.isArray(response)) {
      return { data: groupCinemasByCity(response) };
    }
    return response;
  } catch (error) {
    console.warn("Falling back to empty cinemas list:", error);
    return { data: [] };
  }
};

export const getCinemaById = async (id: string): Promise<ICinema> => {
  const cinema = await apiFetch<ICinema>(`/cinemas/${id}`);
  return cinema;
};

export const getCinemaBySlug = async (slug: string): Promise<ICinema> => {
  // fetchOrNotFound: an unknown slug must yield a 404, not a 500
  // (this is called directly from generateMetadata).
  return fetchOrNotFound(() => apiFetch<ICinema>(`/cinemas/${slug}`));
};

// Poland bounding box, used to drop cinemas with wrongly geocoded
// coordinates that would otherwise render outside the country.
const POLAND_BOUNDS = {
  minLat: 49.0,
  maxLat: 54.9,
  minLng: 14.1,
  maxLng: 24.2,
};

function isWithinPoland(latitude: number, longitude: number): boolean {
  return (
    latitude >= POLAND_BOUNDS.minLat &&
    latitude <= POLAND_BOUNDS.maxLat &&
    longitude >= POLAND_BOUNDS.minLng &&
    longitude <= POLAND_BOUNDS.maxLng
  );
}

export const getCinemasWithCoordinates = async (): Promise<ICinema[]> => {
  try {
    const { data: groups } = await getCinemas({ limit: 1000 });

    const slugs = groups.flatMap((g) => g.cinemas.map((c) => c.slug));

    const results = await Promise.allSettled(
      slugs.map((slug) => getCinemaBySlug(slug))
    );

    return results
      .filter(
        (r): r is PromiseFulfilledResult<ICinema> => r.status === "fulfilled"
      )
      .map((r) => r.value)
      .filter(
        (c) =>
          c.latitude !== null &&
          c.longitude !== null &&
          isWithinPoland(c.latitude, c.longitude)
      );
  } catch (error) {
    console.warn("Failed to fetch cinemas with coordinates:", error);
    return [];
  }
};

interface CinemaPageFilters {
  genreId?: string | null;
  dateFrom?: string | null;
  dateTo?: string | null;
  search?: string | null;
}

export const getCinemaPageData = async (
  slug: string,
  filters: CinemaPageFilters = {}
): Promise<{ cinema: ICinema; screenings: IScreeningGroup[] }> => {
  return fetchOrNotFound(async () => {
    const cinema = await getCinemaBySlug(slug);

    if (cinema.slug !== slug) {
      permanentRedirect(`/kina/${cinema.slug}`);
    }

    const screenings = await getScreenings({
      cinemaId: cinema.id.toString(),
      ...filters,
    });

    return { cinema, screenings };
  });
};
