import { ICinema, ICinemaGroup, ICinemaSummary } from "@/interfaces/ICinema";
import { apiFetch } from "./client";

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
  const cinema = await apiFetch<ICinema>(`/cinemas/${slug}`);
  return cinema;
};

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
      .filter((c) => c.latitude !== null && c.longitude !== null);
  } catch (error) {
    console.warn("Failed to fetch cinemas with coordinates:", error);
    return [];
  }
};
