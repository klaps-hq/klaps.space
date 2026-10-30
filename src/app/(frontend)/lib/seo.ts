export const BASE_OPEN_GRAPH = {
  locale: "pl_PL",
  siteName: "Klaps",
} as const;

export const NOINDEX_FOLLOW = {
  robots: {
    index: false,
    follow: true,
  },
} as const;

/**
 * Polish locative preposition: "we" before a w-/f- consonant cluster
 * (we Wrocławiu, we Włocławku, we Fromborku), otherwise "w" (w Krakowie).
 */
export const wPrep = (locative: string): "w" | "we" =>
  /^[wWfF][bcćdfghjklłmnńprsśtwzźż]/.test(locative) ? "we" : "w";

/** "w Krakowie" / "we Wrocławiu" - preposition plus the locative name. */
export const inPlace = (locative: string): string =>
  `${wPrep(locative)} ${locative}`;

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

/**
 * Newest parsable `updatedAt` from a list, as an ISO string, or undefined.
 * Backs JSON-LD `dateModified` so the freshness signal reflects a real data
 * change instead of render time. Undefined (field omitted) is better than a
 * fabricated date when nothing carries a timestamp.
 */
export const newestUpdatedAtIso = (
  items: ReadonlyArray<{ updatedAt?: string | null }>
): string | undefined => {
  let newest = 0;
  for (const item of items) {
    if (!item.updatedAt) continue;
    const time = new Date(item.updatedAt).getTime();
    if (!Number.isNaN(time) && time > newest) newest = time;
  }
  return newest > 0 ? new Date(newest).toISOString() : undefined;
};

/**
 * Trim free text (e.g. a bio) to a SERP-friendly length at a word boundary,
 * adding an ellipsis. Used to derive meta descriptions from longer copy.
 */
export const clampText = (text: string, max = 160): string => {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= max) return normalized;
  const cut = normalized.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  const trimmed = lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut;
  return `${trimmed.trimEnd()}…`;
};

/** Date in Polish long form, e.g. "7 czerwca 2026". Used for the visible
 * "repertoire updated" note that mirrors dateModified in JSON-LD. */
export const formatPlDate = (date: Date): string =>
  new Intl.DateTimeFormat("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Warsaw",
  }).format(date);

/** Query params that change the visible result set on listing pages. */
const SCREENING_FILTER_PARAM_KEYS = [
  "city",
  "voivodeship",
  "genres",
  "dateFrom",
  "dateTo",
  "search",
  // "Moje kina": the visitor's starred cinemas, a per-browser view.
  "moje",
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

/** Page number from a `?page=` param: a positive integer, anything else is 1. */
export const parsePageParam = (raw: string | undefined): number => {
  const parsed = Number(raw);
  return Number.isInteger(parsed) && parsed >= 1 ? parsed : 1;
};

/**
 * Canonical and rel prev/next links for a paginated listing. Page 1 lives
 * on the clean URL (no `?page=1` duplicate). Callers pass the clamped page
 * number, so the canonical always points at a page that actually renders.
 */
export const buildPaginationMeta = (
  baseUrl: string,
  currentPage: number,
  totalPages: number
): {
  canonical: string;
  pagination: { previous?: string; next?: string };
} => {
  const pageUrl = (page: number): string =>
    page <= 1 ? baseUrl : `${baseUrl}?page=${page}`;

  return {
    canonical: pageUrl(currentPage),
    pagination: {
      previous: currentPage > 1 ? pageUrl(currentPage - 1) : undefined,
      next: currentPage < totalPages ? pageUrl(currentPage + 1) : undefined,
    },
  };
};

// ~60 characters is what a desktop SERP renders before cutting the title.
const MAX_SERP_TITLE_LENGTH = 60;

const normalizeForMatch = (value: string): string =>
  value.toLocaleLowerCase("pl").normalize("NFD").replace(/\p{M}/gu, "");

/**
 * Venue name plus the city in the nominative, unless the name already
 * carries it ("Kino Muranów Warszawa", but "Kino Pod Baranami" in Kraków
 * gets the city appended). Mirrors the navigational queries in GSC:
 * "[sieć] [galeria] [miasto] repertuar", "[kino] [miasto] repertuar".
 */
export const cinemaWithCity = (cinemaName: string, cityName: string): string =>
  normalizeForMatch(cinemaName).includes(normalizeForMatch(cityName))
    ? cinemaName
    : `${cinemaName} ${cityName}`;

/**
 * Cinema page <title>, before the " - Klaps" template suffix.
 * Independent venues: "Kino Pod Baranami Kraków: repertuar i seanse
 * specjalne". "Godziny seansów" was dropped (content audit, October 2026):
 * ~40% of cinema pages had nothing upcoming at any given time, so the title
 * promised a timetable the page could not show. Chain venues keep the
 * special-screenings angle: this site lists only the special programme of a
 * multiplex, so promising its full repertoire would disappoint the visitor.
 * Degrades to a shorter suffix instead of letting the SERP cut it.
 */
export const cinemaPageTitle = (
  cinemaName: string,
  cityName: string,
  isChain: boolean
): string => {
  const subject = cinemaWithCity(cinemaName, cityName);
  const [full, short] = isChain
    ? ["seanse specjalne i klasyka", "seanse specjalne"]
    : ["repertuar i seanse specjalne", "repertuar"];
  const fullTitle = `${subject}: ${full}`;
  return fullTitle.length <= MAX_SERP_TITLE_LENGTH
    ? fullTitle
    : `${subject}: ${short}`;
};

// The layout template appends " - Klaps" (8 chars) to every page title.
const TEMPLATE_SUFFIX_LENGTH = 8;

/**
 * Movie page <title>, before the template suffix. "gdzie i kiedy" mirrors
 * the dominant query pattern ("[tytuł] kiedy w kinie"), but with the year
 * and the suffix it ran past ~60 chars on half the pages (content audit,
 * October 2026), so it degrades to shorter forms instead of being cut.
 */
export const moviePageTitle = (title: string, year: number): string => {
  const subject = `${title} (${year})`;
  const budget = MAX_SERP_TITLE_LENGTH - TEMPLATE_SUFFIX_LENGTH;
  const candidates = [
    `${subject} - seanse: gdzie i kiedy w kinie`,
    `${subject} - seanse w kinach`,
    `${subject} w kinie`,
  ];
  return candidates.find((text) => text.length <= budget) ?? subject;
};
