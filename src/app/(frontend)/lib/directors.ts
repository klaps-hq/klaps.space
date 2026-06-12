import { permanentRedirect } from "next/navigation";
import { IDirector } from "@/interfaces/IDirectors";
import { IMovieSummary, PaginatedResponse } from "@/interfaces/IMovies";
import { IScreeningGroup } from "@/interfaces/IScreenings";
import { apiFetch, fetchOrNotFound } from "./client";

/**
 * Upcoming-screenings threshold below which a director page is thin content:
 * it gets a noindex meta and is left out of the sitemap / static prebuild.
 * Mirrors the backend's sitemap `directors` filter.
 */
export const DIRECTOR_INDEX_THRESHOLD = 3;

interface GetDirectorsParams {
  page?: number;
  /** Omit to receive every director in a single page (meta.totalPages = 1). */
  limit?: number | null;
  search?: string | null;
}

interface GetDirectorScreeningsParams {
  cityId?: string | null;
  // The API prioritizes city over voivodeship - callers send one of them.
  voivodeship?: string | null;
  genreId?: string | null;
  dateFrom?: string | null;
  dateTo?: string | null;
  search?: string | null;
  limit?: number | null;
}

const emptyPage = <T>(
  page: number,
  limit: number
): PaginatedResponse<T> => ({
  data: [],
  meta: { total: 0, page, limit, totalPages: 0 },
});

export const getDirectors = async (
  params: GetDirectorsParams = {}
): Promise<PaginatedResponse<IDirector>> => {
  try {
    return await apiFetch<PaginatedResponse<IDirector>>("/directors", {
      params: {
        page: params.page ? params.page.toString() : "",
        // Empty values are dropped by apiFetch, so omitting `limit` here
        // makes the API return the full list in one page.
        limit: params.limit ? params.limit.toString() : "",
        search: params.search ?? "",
      },
    });
  } catch (error) {
    console.warn("Falling back to empty directors list:", error);
    return emptyPage<IDirector>(params.page ?? 1, params.limit ?? 0);
  }
};

export const getDirectorBySlug = async (slug: string): Promise<IDirector> =>
  apiFetch<IDirector>(`/directors/${slug}`);

export const getDirectorPageData = async (
  slug: string
): Promise<IDirector> =>
  fetchOrNotFound(async () => {
    const director = await getDirectorBySlug(slug);

    // The slug is frozen, so this rarely fires, but a stale link to an old
    // slug must 301 to the canonical one.
    if (director.slug !== slug) {
      permanentRedirect(`/rezyserzy/${director.slug}`);
    }

    return director;
  });

export const getMoviesByDirector = async (
  directorId: number
): Promise<PaginatedResponse<IMovieSummary>> => {
  try {
    return await apiFetch<PaginatedResponse<IMovieSummary>>("/movies", {
      params: {
        directorId: directorId.toString(),
        // A single page covers the whole filmography for the page and JSON-LD.
        limit: "100",
      },
    });
  } catch (error) {
    console.warn("Falling back to empty director filmography:", error);
    return emptyPage<IMovieSummary>(1, 100);
  }
};

export const getScreeningsByDirector = async (
  directorId: number,
  params: GetDirectorScreeningsParams = {}
): Promise<IScreeningGroup[]> => {
  try {
    const response = await apiFetch<
      IScreeningGroup[] | PaginatedResponse<IScreeningGroup>
    >("/screenings", {
      params: {
        directorId: directorId.toString(),
        cityId: params.cityId ?? "",
        voivodeship: params.voivodeship ?? "",
        genreId: params.genreId ?? "",
        dateFrom: params.dateFrom ?? "",
        dateTo: params.dateTo ?? "",
        search: params.search ?? "",
        limit: params.limit ? params.limit.toString() : "",
      },
    });

    return Array.isArray(response) ? response : [...response.data];
  } catch (error) {
    console.warn("Falling back to empty director screenings list:", error);
    return [];
  }
};
