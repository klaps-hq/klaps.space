import { Metadata } from "next";
import { currentMonth, getMonthStats } from "@/lib/month-stats";
import MonthStatsView from "./_components/month-stats-view";
import { buildMonthStatsMetadata } from "./_components/month-stats-metadata";

// The current month grows as cinemas publish repertoire; the endpoint is
// cached for an hour, so the page follows the same cadence.
export const revalidate = 3600;

export const generateMetadata = async (): Promise<Metadata> => {
  const month = currentMonth();
  return buildMonthStatsMetadata(month, await getMonthStats(month), true);
};

const KlapsInNumbersPage = async () => {
  const month = currentMonth();
  const stats = await getMonthStats(month);
  return <MonthStatsView month={month} stats={stats} ongoing />;
};

export default KlapsInNumbersPage;
