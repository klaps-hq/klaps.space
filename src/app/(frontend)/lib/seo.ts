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

export const hasQueryParams = (params: object | null | undefined): boolean =>
  params != null &&
  Object.values(params).some((value: unknown) =>
    Array.isArray(value)
      ? value.some(
          (item) => typeof item === "string" && item.trim().length > 0
        )
      : typeof value === "string" && value.trim().length > 0
  );
