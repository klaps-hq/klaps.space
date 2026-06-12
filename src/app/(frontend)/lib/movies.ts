import { permanentRedirect } from "next/navigation";
import { IMovie, IMovieSummary, PaginatedResponse } from "@/interfaces/IMovies";
import { IScreening } from "@/interfaces/IScreenings";
import { apiFetch, fetchOrNotFound } from "./client";
import { getMovieScreenings } from "./screenings";
import { tmdbImageSrc } from "./tmdb";

interface GetMoviesParams {
  page?: number;
  limit?: number;
  search?: string | null;
  genreId?: string | null;
}

export const getMovies = async (
  params: GetMoviesParams = {}
): Promise<PaginatedResponse<IMovieSummary>> => {
  try {
    const response = await apiFetch<PaginatedResponse<IMovieSummary>>("/movies", {
      params: {
        page: (params.page ?? 1).toString(),
        limit: (params.limit ?? 20).toString(),
        search: params.search ?? "",
        genreId: params.genreId ?? "",
      },
    });
    return response;
  } catch (error) {
    console.warn("Falling back to empty movies list:", error);
    return {
      data: [],
      meta: {
        total: 0,
        page: params.page ?? 1,
        limit: params.limit ?? 20,
        totalPages: 0,
      },
    };
  }
};

// Safety cap so a misbehaving feed can never loop forever: 50 pages x 100 =
// 5000 movies, comfortably above the real catalogue.
const MAX_POSTER_PAGES = 50;

// tmdbImageSrc returns absolute URLs (mirror when configured, TMDB CDN
// otherwise) and passes non-TMDB absolute values through untouched.
const toAbsolutePosterUrl = (posterUrl: string): string =>
  tmdbImageSrc(posterUrl, "w780");

/**
 * slug -> absolute poster URL for every movie that has one. Backs the
 * <image:image> entries in sitemap.xml. Paginates the movies feed; getMovies
 * swallows errors into an empty page, so a failed request just ends the loop.
 */
export const getMoviePosterMap = async (): Promise<Map<string, string>> => {
  const posters = new Map<string, string>();
  let page = 1;
  let totalPages = 1;

  do {
    const { data, meta } = await getMovies({ page, limit: 100 });
    for (const movie of data) {
      if (movie.posterUrl) {
        posters.set(movie.slug, toAbsolutePosterUrl(movie.posterUrl));
      }
    }
    totalPages = meta.totalPages || 1;
    page += 1;
  } while (page <= totalPages && page <= MAX_POSTER_PAGES);

  return posters;
};

export const getMovieBySlug = async (slug: string): Promise<IMovie> => {
  return fetchOrNotFound(() => apiFetch<IMovie>(`/movies/${slug}`));
};

export const getMoviePageData = async (
  slug: string
): Promise<{
  movie: IMovie;
  screenings: IScreening[];
}> => {
  return fetchOrNotFound(async () => {
    const movie = await getMovieBySlug(slug);

    if (movie.slug !== slug) {
      permanentRedirect(`/filmy/${movie.slug}`);
    }

    // Always fetch the nationwide list so the page can be statically
    // cached (ISR); the preferred-city filter is applied client-side
    // in MovieScreenings instead of via the request cookie.
    const screenings = await getMovieScreenings({
      movieId: movie.id.toString(),
    });

    return { movie, screenings };
  });
};
