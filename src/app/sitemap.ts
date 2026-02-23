import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-config";
import { getMovies } from "@/lib/movies";
import { getCinemas } from "@/lib/cinemas";
import { getCities } from "@/lib/cities";
import { getGenres } from "@/lib/genres";
import { getScreenings } from "@/lib/screenings";

export const dynamic = "force-dynamic";

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const now = new Date().toISOString();

  const [moviesResponse, cinemasResponse, cities, genres, screeningGroups] =
    await Promise.all([
      getMovies({ page: 1, limit: 5000 }),
      getCinemas({ limit: 5000 }),
      getCities(),
      getGenres(),
      getScreenings({ limit: 5000 }),
    ]);

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

  const moviePages: MetadataRoute.Sitemap = moviesResponse.data.map(
    (movie) => ({
      url: `${SITE_URL}/filmy/${movie.slug}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.7,
    })
  );

  const cinemaPages: MetadataRoute.Sitemap = cinemasResponse.data.flatMap(
    (group) =>
      group.cinemas.map((cinema) => ({
        url: `${SITE_URL}/kina/${cinema.slug}`,
        lastModified: now,
        changeFrequency: "daily" as const,
        priority: 0.6,
      }))
  );

  const cityPages: MetadataRoute.Sitemap = cities.map((city) => ({
    url: `${SITE_URL}/miasta/${city.slug}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.6,
  }));

  const genrePages: MetadataRoute.Sitemap = genres.map((genre) => ({
    url: `${SITE_URL}/gatunki/${genre.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  const nowDate = new Date();
  const screeningPages: MetadataRoute.Sitemap = screeningGroups.flatMap(
    (group) =>
      group.screenings
        .filter((screening) => new Date(screening.dateTime) >= nowDate)
        .map((screening) => ({
          url: `${SITE_URL}/seanse/${screening.id}`,
          lastModified: screening.dateTime,
          changeFrequency: "daily" as const,
          priority: 0.6,
        }))
  );

  return [
    ...staticPages,
    ...moviePages,
    ...cinemaPages,
    ...cityPages,
    ...genrePages,
    ...screeningPages,
  ];
};

export default sitemap;
