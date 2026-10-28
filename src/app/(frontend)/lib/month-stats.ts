import { IMonthStats } from "@/interfaces/IMonthStats";
import { apiFetch } from "./client";
import { inPlace, pluralPl } from "./seo";
import { getDateString } from "./utils";

/**
 * First month with screening data in the database. Earlier months come back
 * as all zeros, so the archive, the sitemap and the month pages start here.
 */
export const FIRST_STATS_MONTH = "2026-03";

const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;

const MONTHS_NOMINATIVE = [
  "styczeń",
  "luty",
  "marzec",
  "kwiecień",
  "maj",
  "czerwiec",
  "lipiec",
  "sierpień",
  "wrzesień",
  "październik",
  "listopad",
  "grudzień",
] as const;

const MONTHS_LOCATIVE = [
  "styczniu",
  "lutym",
  "marcu",
  "kwietniu",
  "maju",
  "czerwcu",
  "lipcu",
  "sierpniu",
  "wrześniu",
  "październiku",
  "listopadzie",
  "grudniu",
] as const;

export const isValidMonth = (month: string): boolean =>
  MONTH_PATTERN.test(month);

/** Current calendar month on Polish clocks, as YYYY-MM. */
export const currentMonth = (): string =>
  getDateString(new Date()).slice(0, 7);

/** shiftMonth("2026-01", -1) → "2025-12". */
export const shiftMonth = (month: string, delta: number): string => {
  const [year, m] = month.split("-").map(Number);
  const date = new Date(Date.UTC(year, m - 1 + delta, 1));
  return date.toISOString().slice(0, 7);
};

/** Finished months with data, newest first. */
export const archiveMonths = (): string[] => {
  const months: string[] = [];
  for (
    let month = shiftMonth(currentMonth(), -1);
    month >= FIRST_STATS_MONTH;
    month = shiftMonth(month, -1)
  ) {
    months.push(month);
  }
  return months;
};

const monthIndex = (month: string): number => Number(month.slice(5, 7)) - 1;

/** "październik 2026" */
export const monthName = (month: string): string =>
  `${MONTHS_NOMINATIVE[monthIndex(month)]} ${month.slice(0, 4)}`;

/** "w październiku 2026", "we wrześniu 2026" */
export const inMonth = (month: string): string =>
  `${inPlace(MONTHS_LOCATIVE[monthIndex(month)])} ${month.slice(0, 4)}`;

export const monthPath = (month: string): string => `/w-liczbach/${month}`;

const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";

/**
 * Classic screenings in one calendar month. Null only during `next build`,
 * where CI has no reachable API; ISR fills the page in on the first
 * revalidation. At runtime a failure rethrows, so Next keeps serving the
 * last good copy instead of caching an empty page.
 */
export const getMonthStats = async (
  month: string
): Promise<IMonthStats | null> => {
  try {
    return await apiFetch<IMonthStats>("/socials/series/stats", {
      params: { month },
      next: { revalidate: 3600 },
    });
  } catch (error) {
    if (isBuildPhase) return null;
    throw error;
  }
};

const NUMBER_FORMAT = new Intl.NumberFormat("pl-PL");

/** Polish digit grouping: "1084", "12 345" (no separator below 10 000). */
export const formatCount = (count: number): string =>
  NUMBER_FORMAT.format(count);

/** "493 seanse", "1 seans", "1085 seansów" */
export const screeningsLabel = (count: number): string =>
  `${formatCount(count)} ${pluralPl(count, "seans", "seanse", "seansów")}`;

/** "159 kinach", "1 kinie" (after "w") */
const cinemasLocative = (count: number): string =>
  `${formatCount(count)} ${count === 1 ? "kinie" : "kinach"}`;

/** "29 miastach", "1 mieście" (after "w") */
const citiesLocative = (count: number): string =>
  `${formatCount(count)} ${count === 1 ? "mieście" : "miastach"}`;

const capitalize = (text: string): string =>
  text.charAt(0).toUpperCase() + text.slice(1);

/**
 * One-sentence summary shared by the meta description, the OG subtitle and
 * the lead, so every surface quotes the same numbers. Built verb-free
 * ("Wrzesień 2026: 1084 seanse ...") so it never has to agree a verb with
 * a Polish numeral. The month still in progress is flagged as such.
 */
export const monthStatsSummary = (
  stats: IMonthStats,
  ongoing: boolean
): string => {
  const label = `${capitalize(monthName(stats.month))}${ongoing ? " (miesiąc w toku)" : ""}`;
  const base = `${label}: ${screeningsLabel(stats.screenings)} klasyki w ${cinemasLocative(stats.cinemas)} i ${citiesLocative(stats.cities)} w Polsce.`;
  return stats.topMovie
    ? `${base} Najczęściej grany film: „${stats.topMovie.movie.title}”.`
    : base;
};
