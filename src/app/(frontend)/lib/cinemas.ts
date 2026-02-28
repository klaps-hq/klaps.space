import { ICinema, ICinemaGroup } from "@/interfaces/ICinema";
import { apiFetch } from "./client";

interface GetCinemasParams {
  cityId?: string | null;
  limit?: number;
}

export const getCinemas = async (
  params: GetCinemasParams = {}
): Promise<{ data: ICinemaGroup[] }> => {
  try {
    const response = await apiFetch<{ data: ICinemaGroup[] }>("/cinemas", {
      params: {
        cityId: params.cityId ?? "",
        limit: params.limit?.toString() ?? "50",
      },
    });

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
