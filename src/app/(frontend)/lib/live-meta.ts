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
