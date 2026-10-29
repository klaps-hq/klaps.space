/**
 * Duplicate venues and cities merged into one canonical page.
 *
 * The scraper keeps two source records for the same place (two listings of
 * one venue, or a city listed twice), and it recreates whatever is deleted,
 * so the duplicates stay in the database. They are merged at the edge
 * instead: the duplicate URL 301s to the canonical one (next.config.ts) and
 * is dropped from the sitemap and the hub links (getSitemapEntries).
 *
 * Keys are the duplicate slugs, values the canonical slugs.
 */
export const MERGED_CINEMA_SLUGS: Readonly<Record<string, string>> = {
  // Same venue at MOK, Warszawska 37: the small "Kino za Rogiem" room is
  // listed separately from the main Kino Sława hall.
  "kino-za-rogiem-miedzyrzec-podlaski": "kino-slawa",
  // Two listings of the summer screenings at the POLIN museum.
  "filmowa-stolica-lata-muzeum-historii-zydow-polskich-warszawa":
    "filmowa-stolica-lata-polin-warszawa",
  // The active Skarżysko-Kamienna record carried a misspelt slug; the slugs
  // were swapped in the database (29.10.2026) and the old URL redirects.
  "kino-centrum-sakrzysko-kamienna": "kino-centrum-skarzysko-kamienna",
};

export const MERGED_CITY_SLUGS: Readonly<Record<string, string>> = {
  "sakrzysko-kamienna": "skarzysko-kamienna",
};
