import { SITE_URL } from "./site-config";

export const BASE_OPEN_GRAPH = {
  locale: "pl_PL",
  siteName: "Klaps",
} as const;

export const DEFAULT_OG_IMAGE = {
  url: `${SITE_URL}/klaps-og.png`,
  width: 1200,
  height: 630,
} as const;

export const NOINDEX_FOLLOW = {
  robots: {
    index: false,
    follow: true,
  },
} as const;

/** Polish noun declension after a numeral: pluralPl(3, "kino", "kina", "kin") → "kina". */
export const pluralPl = (
  count: number,
  one: string,
  few: string,
  many: string
): string => {
  if (count === 1) return one;
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
};

/** Date in Polish long form, e.g. "7 czerwca 2026". Used for the visible
 * "repertoire updated" note that mirrors dateModified in JSON-LD. */
export const formatPlDate = (date: Date): string =>
  new Intl.DateTimeFormat("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);

/** Query params that change the visible result set on listing pages. */
export const SCREENING_FILTER_PARAM_KEYS = [
  "city",
  "voivodeship",
  "genres",
  "dateFrom",
  "dateTo",
  "search",
] as const;

const isNonEmptyParam = (value: unknown): boolean =>
  Array.isArray(value)
    ? value.some((item) => typeof item === "string" && item.trim().length > 0)
    : typeof value === "string" && value.trim().length > 0;

/**
 * True only when one of the known filter params carries a value.
 * Unknown params (utm_*, fbclid, ...) are ignored on purpose: those URLs
 * stay indexable and the canonical consolidates them onto the clean URL.
 */
export const hasFilterParams = (
  // Accepts plain interfaces (no index signature) - values are read
  // through a Record cast.
  params: object | null | undefined,
  keys: readonly string[] = SCREENING_FILTER_PARAM_KEYS
): boolean =>
  params != null &&
  keys.some((key) =>
    isNonEmptyParam((params as Record<string, unknown>)[key])
  );
