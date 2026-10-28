import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import {
  archiveMonths,
  currentMonth,
  FIRST_STATS_MONTH,
  getMonthStats,
  isValidMonth,
} from "@/lib/month-stats";
import MonthStatsView from "../_components/month-stats-view";
import { buildMonthStatsMetadata } from "../_components/month-stats-metadata";

export const revalidate = 3600;

type MonthPageProps = {
  params: Promise<{ miesiac: string }>;
};

// Finished months only. The current month lives on /w-liczbach, and months
// before the first one with data or in the future have nothing to show.
const resolveMonth = async (params: MonthPageProps["params"]) => {
  const { miesiac } = await params;
  if (!isValidMonth(miesiac)) notFound();
  if (miesiac === currentMonth()) redirect("/w-liczbach");
  if (miesiac < FIRST_STATS_MONTH || miesiac > currentMonth()) notFound();
  return miesiac;
};

export const generateStaticParams = async (): Promise<{ miesiac: string }[]> =>
  archiveMonths().map((miesiac) => ({ miesiac }));

export const generateMetadata = async ({
  params,
}: MonthPageProps): Promise<Metadata> => {
  const month = await resolveMonth(params);
  return buildMonthStatsMetadata(month, await getMonthStats(month), false);
};

const MonthStatsPage = async ({ params }: MonthPageProps) => {
  const month = await resolveMonth(params);
  const stats = await getMonthStats(month);
  // A finished month with no screenings is not worth a page.
  if (stats && stats.screenings === 0) notFound();
  return <MonthStatsView month={month} stats={stats} ongoing={false} />;
};

export default MonthStatsPage;
