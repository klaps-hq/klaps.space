import { buildOgImage } from "@/lib/og-image";
import {
  getMonthStats,
  monthName,
  screeningsLabel,
} from "@/lib/month-stats";
import { tmdbImageSrc } from "@/lib/tmdb";

/** OG card for one month: the headline number, the top movie's poster. */
export const buildMonthStatsOgImage = async (month: string) => {
  const stats = await getMonthStats(month).catch(() => null);
  const posterUrl = stats?.topMovie?.movie.posterUrl;

  return buildOgImage({
    eyebrow: "Klaps w liczbach",
    title: monthName(month),
    subtitle:
      stats && stats.screenings > 0
        ? `${screeningsLabel(stats.screenings)} klasyki w kinach w Polsce`
        : "Seanse klasyki w kinach w Polsce",
    posterUrl: posterUrl ? tmdbImageSrc(posterUrl, "w500") : null,
  });
};
