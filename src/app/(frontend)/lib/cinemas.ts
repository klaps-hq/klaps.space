import { ICinema, ICinemaGroup, ICinemaSummary } from "@/interfaces/ICinema";
import { apiFetch } from "./client";

const CINEMAS_LIMIT = 20;

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
        limit: (params.limit ?? CINEMAS_LIMIT).toString(),
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
