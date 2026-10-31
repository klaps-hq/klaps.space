import { IProgrammeProfile } from "@/interfaces/IProgrammeProfile";
import { apiFetch } from "./client";
import { formatCount } from "./month-stats";
import { studioCinemas } from "./programme-profile";
import { pluralPl } from "./seo";

export const WAJDA_SLUG = "andrzej-wajda";
export const WAJDA_YEAR_PATH = "/rok-wajdy";
export const WAJDA_YEAR = 2026;

/** Months the chart covers: screening history starts in March 2026. */
export const WAJDA_YEAR_FIRST_MONTH = `${WAJDA_YEAR}-03`;
export const WAJDA_YEAR_LAST_MONTH = `${WAJDA_YEAR}-12`;

/**
 * The ten largest Polish cities by population (GUS), the same order as the
 * `population` column in the API. Fixed rather than derived, because most
 * cities in the database carry no population figure.
 */
export const LARGEST_CITIES: readonly { slug: string; name: string }[] = [
  { slug: "warszawa", name: "Warszawa" },
  { slug: "krakow", name: "Kraków" },
  { slug: "lodz", name: "Łódź" },
  { slug: "wroclaw", name: "Wrocław" },
  { slug: "poznan", name: "Poznań" },
  { slug: "gdansk", name: "Gdańsk" },
  { slug: "szczecin", name: "Szczecin" },
  { slug: "bydgoszcz", name: "Bydgoszcz" },
  { slug: "lublin", name: "Lublin" },
  { slug: "bialystok", name: "Białystok" },
];

const LARGEST_CITY_SLUGS = new Set(LARGEST_CITIES.map((c) => c.slug));

export interface WajdaYearData {
  profile: IProgrammeProfile;
  /**
   * The API answered the year query with every city listed (`allCities`),
   * so city shares are exact. False on an API that predates the monthly
   * breakdown: the page then falls back to the top-five profile and hides
   * what it cannot compute.
   */
  complete: boolean;
}

const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";

const fetchProfile = (params: Record<string, string>) =>
  apiFetch<IProgrammeProfile>("/screenings/profile", {
    params: { directorSlug: WAJDA_SLUG, ...params },
    next: { revalidate: 3600 },
  });

/**
 * Andrzej Wajda's programme profile for the year. The year query
 * (`from`/`to`/`allCities`) is new; an older API rejects unknown params
 * with 400, so on failure the plain director profile is tried instead,
 * which on that API covers the same span (history starts in March 2026).
 *
 * Null only during `next build`, which may run without a reachable API. At
 * runtime a failure rethrows, so ISR keeps serving the last good copy
 * instead of caching an empty press page.
 */
export const getWajdaYearData = async (): Promise<WajdaYearData | null> => {
  try {
    const profile = await fetchProfile({
      from: `${WAJDA_YEAR}-01-01`,
      to: `${WAJDA_YEAR}-12-31`,
      allCities: "true",
    });
    return { profile, complete: Array.isArray(profile.byMonth) };
  } catch (error) {
    console.warn("Wajda year profile query failed, trying plain:", error);
  }
  try {
    const profile = await fetchProfile({});
    return { profile, complete: false };
  } catch (error) {
    if (isBuildPhase) return null;
    throw error;
  }
};

export interface MonthBar {
  month: string;
  /** Null for months that have not started yet. */
  screenings: number | null;
  /** The month is still in progress, so its count will grow. */
  partial: boolean;
}

/**
 * March to December, one entry per month, with the profile's counts. Months
 * after `until` (the last past screening) have no data yet; the month of
 * `until` is partial unless the year is over.
 */
export const yearMonthBars = (
  profile: IProgrammeProfile,
  today: string
): MonthBar[] => {
  const counts = new Map(
    (profile.byMonth ?? []).map((m) => [m.month, m.screenings])
  );
  const currentMonth = today.slice(0, 7);
  const bars: MonthBar[] = [];
  for (let m = 3; m <= 12; m += 1) {
    const month = `${WAJDA_YEAR}-${String(m).padStart(2, "0")}`;
    const started = month <= currentMonth;
    bars.push({
      month,
      screenings: started ? (counts.get(month) ?? 0) : null,
      partial: month === currentMonth,
    });
  }
  return bars;
};

export interface OutsideLargestCities {
  /** Screenings outside the ten largest cities. */
  screenings: number;
  share: number;
  /** Cities outside the ten largest with at least one screening. */
  cities: number;
}

/** Needs every city in the profile (`complete`), otherwise null. */
export const outsideLargestCities = (
  data: WajdaYearData
): OutsideLargestCities | null => {
  const { profile, complete } = data;
  if (!complete || profile.screenings === 0) return null;
  const outside = profile.topCities.filter(
    (c) => !LARGEST_CITY_SLUGS.has(c.slug)
  );
  const screenings = outside.reduce((sum, c) => sum + c.count, 0);
  return {
    screenings,
    share: Math.round((screenings / profile.screenings) * 100),
    cities: outside.length,
  };
};

/**
 * One verb-free sentence shared by the lead, the meta description and the
 * OG subtitle, so every surface quotes the same numbers.
 */
export const wajdaYearSummary = (profile: IProgrammeProfile): string =>
  `Filmy Andrzeja Wajdy w polskich kinach w ${WAJDA_YEAR} roku: ${formatCount(profile.screenings)} ${pluralPl(profile.screenings, "seans", "seanse", "seansów")}, ${formatCount(profile.movies)} ${pluralPl(profile.movies, "film", "filmy", "filmów")}, ${formatCount(profile.cinemas)} ${pluralPl(profile.cinemas, "kino", "kina", "kin")} i ${formatCount(profile.cities)} ${pluralPl(profile.cities, "miasto", "miasta", "miast")}.`;

/** Studio cinemas only; the director profile already leaves chains out. */
export const topStudioCinemas = (profile: IProgrammeProfile, limit = 10) =>
  studioCinemas(profile).slice(0, limit);
