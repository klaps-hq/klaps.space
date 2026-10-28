import { Metadata } from "next";
import { IMonthStats } from "@/interfaces/IMonthStats";
import { monthName, monthPath, monthStatsSummary } from "@/lib/month-stats";
import { SITE_URL } from "@/lib/site-config";
import { BASE_OPEN_GRAPH, clampText, NOINDEX_FOLLOW } from "@/lib/seo";

/**
 * Shared by the current-month hub and the archive pages. The hub owns the
 * current month's canonical (/w-liczbach); its /w-liczbach/YYYY-MM twin
 * redirects there until the month ends.
 */
export const buildMonthStatsMetadata = (
  month: string,
  stats: IMonthStats | null,
  ongoing: boolean
): Metadata => {
  const title = `Klaps w liczbach: ${monthName(month)}`;
  const url = `${SITE_URL}${ongoing ? "/w-liczbach" : monthPath(month)}`;
  const hasData = stats !== null && stats.screenings > 0;
  const description = hasData
    ? clampText(monthStatsSummary(stats, ongoing))
    : "Ile seansów klasyki filmowej grają kina w Polsce? Miesięczne zestawienie Klapsa: liczba seansów, kin i miast, najczęściej grane filmy.";

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      ...BASE_OPEN_GRAPH,
      type: "website",
      title,
      description,
      url,
    },
    // An empty month is a thin page; keep it out of the index.
    ...(hasData ? {} : NOINDEX_FOLLOW),
  };
};
