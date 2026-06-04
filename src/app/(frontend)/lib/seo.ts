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

export const hasQueryParams = (params: object | null | undefined): boolean =>
  params != null &&
  Object.values(params).some((value: unknown) =>
    Array.isArray(value)
      ? value.some(
          (item) => typeof item === "string" && item.trim().length > 0
        )
      : typeof value === "string" && value.trim().length > 0
  );
