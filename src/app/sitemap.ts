import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-config";
import { getMovies } from "@/lib/movies";
import { getCinemas } from "@/lib/cinemas";
import { getCities } from "@/lib/cities";
import { getGenres } from "@/lib/genres";
import { getScreenings } from "@/lib/screenings";

export const revalidate = 3600;

const sanitizeSlug = (slug: string | null | undefined) => slug?.trim() ?? "";
const isValidSlug = (slug: string) =>
  slug.length > 0 && !slug.includes("/") && !slug.includes("?") && !slug.includes("#");
const sanitizeNumericId = (value: unknown) => {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};
const isValidDate = (value: string) => !Number.isNaN(new Date(value).getTime());

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const now = new Date().toISOString();

  const [moviesResult, cinemasResult, citiesResult, genresResult, screeningsResult] =
    await Promise.allSettled([
      getMovies({ page: 1, limit: 1000 }),
      getCinemas(),
      getCities(),
      getGenres(),
      getScreenings(),
    ]);

  const movies = moviesResult.status === "fulfilled" ? moviesResult.value.data : [];
  const cinemaGroups =
    cinemasResult.status === "fulfilled" ? cinemasResult.value.data : [];
  const cities = citiesResult.status === "fulfilled" ? citiesResult.value : [];
  const genres = genresResult.status === "fulfilled" ? genresResult.value : [];
  const screeningGroups =
    screeningsResult.status === "fulfilled" ? screeningsResult.value : [];

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/seanse`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/filmy`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/kina`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/miasta`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/gatunki`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/o-projekcie`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/jak-to-dziala`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/kontakt`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/faq`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/regulamin`, changeFrequency: "monthly", priority: 0.2 },
    { url: `${SITE_URL}/polityka-prywatnosci`, changeFrequency: "monthly", priority: 0.2 },
    { url: `${SITE_URL}/dostepnosc`, changeFrequency: "monthly", priority: 0.2 },
    { url: `${SITE_URL}/mapa-witryny`, lastModified: now, changeFrequency: "weekly", priority: 0.2 },
  ];

  const moviePages: MetadataRoute.Sitemap = movies
    .map((movie) => sanitizeSlug(movie.slug))
    .filter(isValidSlug)
    .map((slug) => ({
      url: `${SITE_URL}/filmy/${encodeURIComponent(slug)}`,
      lastModified: now,
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
          lastModified: now,
          changeFrequency: "daily" as const,
          priority: 0.6,
        }))
  );

  const cityPages: MetadataRoute.Sitemap = cities
    .map((city) => sanitizeSlug(city.slug))
    .filter(isValidSlug)
    .map((city) => ({
      url: `${SITE_URL}/miasta/${encodeURIComponent(city)}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.6,
    }));

  const genrePages: MetadataRoute.Sitemap = genres
    .map((genre) => sanitizeSlug(genre.slug))
    .filter(isValidSlug)
    .map((genre) => ({
      url: `${SITE_URL}/gatunki/${encodeURIComponent(genre)}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    }));

  const nowDate = new Date();
  const screeningPages: MetadataRoute.Sitemap = screeningGroups.flatMap(
    (group) =>
      group.screenings
        .filter(
          (screening) =>
            isValidDate(screening.dateTime) && new Date(screening.dateTime) >= nowDate
        )
        .map((screening) => ({
          url: `${SITE_URL}/seanse/${sanitizeNumericId(screening.id)}`,
          lastModified: screening.dateTime,
          changeFrequency: "daily" as const,
          priority: 0.6,
        }))
        .filter((item) => !item.url.endsWith("/null"))
  );

  const allPages = [
    ...staticPages,
    ...moviePages,
    ...cinemaPages,
    ...cityPages,
    ...genrePages,
    ...screeningPages,
  ];

  return Array.from(new Map(allPages.map((item) => [item.url, item])).values());
};

export default sitemap;
