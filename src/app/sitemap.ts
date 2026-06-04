import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-config";
import { getMovies } from "@/lib/movies";
import { getCinemas } from "@/lib/cinemas";
import { getGenres } from "@/lib/genres";

export const revalidate = 3600;

const sanitizeSlug = (slug: string | null | undefined) => slug?.trim() ?? "";
const isValidSlug = (slug: string) =>
  slug.length > 0 && !slug.includes("/") && !slug.includes("?") && !slug.includes("#");

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const [moviesResult, cinemasResult, genresResult] = await Promise.allSettled([
    getMovies({ page: 1, limit: 1000 }),
    getCinemas(),
    getGenres(),
  ]);

  const movies = moviesResult.status === "fulfilled" ? moviesResult.value.data : [];
  const cinemaGroups =
    cinemasResult.status === "fulfilled" ? cinemasResult.value.data : [];
  const genres = genresResult.status === "fulfilled" ? genresResult.value : [];

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/seanse`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/kina`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/mapa-kin`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/miasta`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/gatunki`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/o-projekcie`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/kontakt`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/faq`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/regulamin`, changeFrequency: "monthly", priority: 0.2 },
    { url: `${SITE_URL}/polityka-prywatnosci`, changeFrequency: "monthly", priority: 0.2 },
  ];

  const moviePages: MetadataRoute.Sitemap = movies
    .map((movie) => sanitizeSlug(movie.slug))
    .filter(isValidSlug)
    .map((slug) => ({
      url: `${SITE_URL}/filmy/${encodeURIComponent(slug)}`,
      changeFrequency: "daily" as const,
      priority: 0.7,
    }));

  const cinemaPages: MetadataRoute.Sitemap = cinemaGroups.flatMap(
    (group) =>
      group.cinemas
        .map((cinema) => sanitizeSlug(cinema.slug))
        .filter(isValidSlug)
        .map((cinema) => ({
          url: `${SITE_URL}/kina/${encodeURIComponent(cinema)}`,
          changeFrequency: "daily" as const,
          priority: 0.6,
        }))
  );

  // Only cities that actually have cinemas — empty city pages are
  // thin content we don't want to submit to Google.
  const cityPages: MetadataRoute.Sitemap = cinemaGroups
    .filter((group) => group.cinemas.length > 0)
    .map((group) => sanitizeSlug(group.city.slug))
    .filter(isValidSlug)
    .map((city) => ({
      url: `${SITE_URL}/miasta/${encodeURIComponent(city)}`,
      changeFrequency: "daily" as const,
      priority: 0.6,
    }));

  const genrePages: MetadataRoute.Sitemap = genres
    .map((genre) => sanitizeSlug(genre.slug))
    .filter(isValidSlug)
    .map((genre) => ({
      url: `${SITE_URL}/gatunki/${encodeURIComponent(genre)}`,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    }));

  const allPages = [
    ...staticPages,
    ...moviePages,
    ...cinemaPages,
    ...cityPages,
    ...genrePages,
  ];

  return Array.from(new Map(allPages.map((item) => [item.url, item])).values());
};

export default sitemap;
