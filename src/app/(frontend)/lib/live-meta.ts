import { WARSAW_TZ } from "./utils";
import { pluralPl } from "./seo";
import { wallTimeToInstant } from "./warsaw-time";

// Live "today" fact for meta descriptions: "dziś 14 seansów, m.in.
// „Diuna” i „Lśnienie”". A concrete, current number reads as fresh in the
// SERP and makes every listing's snippet unique. Pages are ISR (5 min), so
// the HTML stays current; Google may show an older snapshot for a while,
// which is why callers only use it when today actually has screenings.

interface DigestGroup {
  movie: { title: string };
  screenings: { dateTime: string }[];
}

export interface TodayDigest {
  /** Screenings still ahead today (Warsaw time). */
  count: number;
  /** Titles playing today, in the incoming (soonest first) order. */
  titles: string[];
}

// Built once: Intl formatters are expensive to construct.
const WARSAW_DATE = new Intl.DateTimeFormat("en-CA", {
  timeZone: WARSAW_TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export const todayDigest = (
  groups: readonly DigestGroup[],
  now: Date = new Date()
): TodayDigest | null => {
  // API dateTimes are Warsaw wall time with a "Z", so their first ten
  // characters are already the Warsaw calendar date.
  const today = WARSAW_DATE.format(now);
  let count = 0;
  const titles: string[] = [];

  for (const group of groups) {
    const remaining = group.screenings.filter(
      ({ dateTime }) =>
        dateTime.slice(0, 10) === today &&
        wallTimeToInstant(dateTime).getTime() >= now.getTime()
    ).length;
    if (remaining === 0) continue;
    count += remaining;
    titles.push(group.movie.title);
  }

  return count > 0 ? { count, titles } : null;
};

export interface UpcomingCounts {
  /** Screenings still ahead today (Warsaw time). */
  today: number;
  /** Screenings still ahead this Saturday and Sunday (the current weekend on weekends). */
  weekend: number;
  /** Every screening still ahead. */
  total: number;
  /** True on Saturday and Sunday, when the weekend count is the current one. */
  isWeekend: boolean;
}

// Built once, like WARSAW_DATE.
const WARSAW_WEEKDAY = new Intl.DateTimeFormat("en-US", {
  timeZone: WARSAW_TZ,
  weekday: "short",
});
const WEEKDAY_INDEX: Record<string, number> = {
  Mon: 0,
  Tue: 1,
  Wed: 2,
  Thu: 3,
  Fri: 4,
  Sat: 5,
  Sun: 6,
};

const addDays = (isoDate: string, days: number): string => {
  const date = new Date(`${isoDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
};

/** Counts for the "Dziś / w weekend" strip above a listing. */
export const upcomingCounts = (
  groups: readonly DigestGroup[],
  now: Date = new Date()
): UpcomingCounts => {
  const today = WARSAW_DATE.format(now);
  const weekday = WEEKDAY_INDEX[WARSAW_WEEKDAY.format(now)] ?? 0;
  // Saturday of this week; on Sunday the weekend already started yesterday.
  const saturday = addDays(today, 5 - weekday);
  const sunday = addDays(saturday, 1);
  const counts: UpcomingCounts = {
    today: 0,
    weekend: 0,
    total: 0,
    isWeekend: weekday >= 5,
  };

  for (const group of groups) {
    for (const { dateTime } of group.screenings) {
      if (wallTimeToInstant(dateTime).getTime() < now.getTime()) continue;
      const day = dateTime.slice(0, 10);
      counts.total += 1;
      if (day === today) counts.today += 1;
      if (day === saturday || day === sunday) counts.weekend += 1;
    }
  }

  return counts;
};

/**
 * Phrase variants from longest to shortest, for callers that pick the
 * first one fitting the snippet budget:
 * "dziś 14 seansów, m.in. „Diuna” i „Lśnienie”", then one title, then none.
 */
export const todayDigestPhrases = (digest: TodayDigest): string[] => {
  const base = `dziś ${digest.count} ${pluralPl(digest.count, "seans", "seanse", "seansów")}`;
  const [first, second] = digest.titles;
  // "m.in." only when more films play today than the snippet names.
  const single = digest.titles.length === 1 ? `${base}: „${first}”` : null;
  return [
    ...(second
      ? [
          digest.titles.length === 2
            ? `${base}: „${first}” i „${second}”`
            : `${base}, m.in. „${first}” i „${second}”`,
        ]
      : []),
    ...(single ? [single] : first ? [`${base}, m.in. „${first}”`] : []),
    base,
  ];
};
