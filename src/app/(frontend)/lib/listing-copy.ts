import { IScreeningGroup } from "@/interfaces/IScreenings";
import { IMovieSummary } from "@/interfaces/IMovies";
import { pluralPl } from "./seo";

/**
 * Auto-generated intro copy for taxonomy/listing pages that have no editorial
 * description. Fed only by data the page already fetches (no extra API calls),
 * it turns near-identical boilerplate into unique, substantive prose per page:
 * real movie titles, cities and counts. This is the fix for "thin/duplicate
 * content" on the programmatic city/genre/director pages.
 *
 * Grammar guardrail: API names arrive in the nominative. City names are only
 * ever placed after "takich jak" (which governs the nominative), never after a
 * preposition that would need a case change. Movie titles are treated as
 * indeclinable proper nouns.
 */

// Non-breaking space, built from a char code so no literal U+00A0 sits in the
// source (keeps the file diffable and avoids invisible whitespace).
const NBSP = String.fromCharCode(160);

// Bind one-letter Polish words (prepositions/conjunctions) to the next word
// with a non-breaking space, matching the &nbsp; typography used site-wide.
const bindOrphans = (text: string): string =>
  text.replace(/(^|[\s(])([aiouwzAIOUWZ])\s+/g, `$1$2${NBSP}`);

// Polish list joiner: ["A", "B", "C"] -> "A, B i C".
const joinPl = (items: string[]): string => {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(", ")} i ${items[items.length - 1]}`;
};

// First `max` distinct movie titles across the screening groups.
const uniqueTitles = (groups: IScreeningGroup[], max: number): string[] => {
  const titles: string[] = [];
  const seen = new Set<string>();
  for (const group of groups) {
    const title = group.movie.title?.trim();
    if (!title || seen.has(title)) continue;
    seen.add(title);
    titles.push(title);
    if (titles.length >= max) break;
  }
  return titles;
};

// Distinct city names across the screening groups (capped at `max`).
const distinctCities = (groups: IScreeningGroup[], max: number): string[] => {
  const cities: string[] = [];
  const seen = new Set<string>();
  for (const group of groups) {
    for (const city of group.summary?.cities ?? []) {
      const name = city?.trim();
      if (!name || seen.has(name)) continue;
      seen.add(name);
      cities.push(name);
      if (cities.length >= max) return cities;
    }
  }
  return cities;
};

const totalCityCount = (groups: IScreeningGroup[]): number =>
  distinctCities(groups, Number.MAX_SAFE_INTEGER).length;

// Most frequent genre names across the groups, lowercased for use inside a
// sentence. Ties keep the order they first appeared in.
const topGenres = (groups: IScreeningGroup[], max: number): string[] => {
  const counts = new Map<string, number>();
  for (const group of groups) {
    for (const genre of group.movie.genres ?? []) {
      const name = genre.name?.trim().toLowerCase();
      if (!name) continue;
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, max)
    .map(([name]) => name);
};

/** Fallback intro for /gatunki/[slug] without an editorial description. */
export const genreFallbackIntro = (
  genreNameLower: string,
  groups: IScreeningGroup[]
): string => {
  const movieCount = groups.length;
  if (movieCount === 0) {
    return bindOrphans(
      `Filmy z gatunku ${genreNameLower} pokazywane w polskich kinach ` +
        `studyjnych. Filtruj po mieście, dacie lub frazie poniżej.`
    );
  }

  const titles = uniqueTitles(groups, 3);
  const cities = distinctCities(groups, 4);
  const totalCities = totalCityCount(groups);

  const lead =
    `W repertuarze polskich kin studyjnych znajdziesz ${movieCount} ` +
    `${pluralPl(movieCount, "film", "filmy", "filmów")} z gatunku ` +
    genreNameLower;
  const first =
    titles.length > 0 ? `${lead}, w tym ${joinPl(titles)}.` : `${lead}.`;

  const second =
    totalCities >= 2 && cities.length >= 2
      ? `Seanse odbywają się w ${totalCities} ` +
        `${pluralPl(totalCities, "mieście", "miastach", "miastach")} w całej ` +
        `Polsce, takich jak ${joinPl(cities)}.`
      : "Seanse specjalne, retrospektywy i klasyka filmowa na dużym ekranie.";

  return bindOrphans(`${first} ${second}`);
};

/** Fallback intro for /miasta/[slug] without an editorial description. */
export const cityFallbackIntro = (
  prepCap: "W" | "We",
  cityLocative: string,
  cinemasCount: number,
  groups: IScreeningGroup[]
): string => {
  // Bind the preposition explicitly: bindOrphans only catches single letters,
  // so "We" (two letters) would otherwise keep a breaking space.
  // "kino z seansami specjalnymi", not "kino studyjne": city listings mix
  // studio cinemas with multiplexes that host special screenings.
  const first =
    `${prepCap}${NBSP}${cityLocative} ` +
    `${pluralPl(cinemasCount, "działa", "działają", "działa")} ${cinemasCount} ` +
    `${pluralPl(cinemasCount, "kino z seansami specjalnymi", "kina z seansami specjalnymi", "kin z seansami specjalnymi")}.`;

  const titles = uniqueTitles(groups, 3);
  const second =
    titles.length > 0
      ? `W najbliższym repertuarze ${joinPl(titles)} - seanse specjalne, ` +
        `retrospektywy i klasyka filmowa na dużym ekranie.`
      : `Sprawdź nadchodzące seanse specjalne, retrospektywy i klasykę ` +
        `filmową na dużym ekranie.`;

  return bindOrphans(`${first} ${second}`);
};

/**
 * Fallback intro for /kina/[slug] without an editorial description.
 *
 * The largest page group on the site (500+), so a single boilerplate
 * sentence differing only by name and city reads to a crawler as duplicate
 * content. This builds from what the page already fetched: live counts, the
 * nearest titles, the dominant genres and the venue type.
 */
export const cinemaFallbackIntro = (
  cinemaName: string,
  cityLocative: string,
  isChain: boolean,
  groups: IScreeningGroup[]
): string => {
  const kind = isChain ? "kino sieciowe" : "kino studyjne";
  const moviesCount = groups.length;

  if (moviesCount === 0) {
    return bindOrphans(
      `${cinemaName} to ${kind} w ${cityLocative}. Nie ma tu teraz ` +
        `zapowiedzianych seansów specjalnych - repertuar uzupełniamy na ` +
        `bieżąco, więc zajrzyj ponownie albo sprawdź inne kina w okolicy.`
    );
  }

  const screeningsCount = groups.reduce(
    (sum, group) => sum + group.screenings.length,
    0
  );
  const titles = uniqueTitles(groups, 3);
  const genres = topGenres(groups, 2);

  const first =
    `${cinemaName} to ${kind} w ${cityLocative}, w którego repertuarze ` +
    `${pluralPl(moviesCount, "jest", "są", "jest")} ${moviesCount} ` +
    `${pluralPl(moviesCount, "film", "filmy", "filmów")} i ` +
    `${screeningsCount} ` +
    `${pluralPl(screeningsCount, "nadchodzący seans", "nadchodzące seanse", "nadchodzących seansów")}.`;

  const second =
    titles.length > 0
      ? `Najbliżej na ekranie ${joinPl(titles)}.`
      : `Sprawdź najbliższe pokazy specjalne.`;

  const third =
    genres.length > 0
      ? `W programie przeważają gatunki takie jak ${joinPl(genres)}.`
      : `W programie retrospektywy, klasyka filmowa i pokazy specjalne.`;

  return bindOrphans(`${first} ${second} ${third}`);
};

/** Fallback intro for /rezyserzy/[slug] without an editorial bio. */
export const directorFallbackIntro = (
  name: string,
  moviesCount: number,
  movies: readonly IMovieSummary[]
): string => {
  if (moviesCount === 0) {
    return bindOrphans(
      `Filmy w reżyserii ${name} pokazywane w polskich kinach studyjnych. ` +
        `Sprawdź filmografię oraz aktualny repertuar seansów specjalnych, ` +
        `retrospektyw i klasyki filmowej.`
    );
  }

  const titles = movies
    .slice(0, 4)
    .map((movie) => `${movie.title} (${movie.productionYear})`);

  const lead =
    `W repertuarze polskich kin studyjnych znajdziesz ${moviesCount} ` +
    `${pluralPl(moviesCount, "film", "filmy", "filmów")} w reżyserii ${name}`;
  const first =
    titles.length > 0 ? `${lead}, w tym ${joinPl(titles)}.` : `${lead}.`;
  const second =
    `Sprawdź filmografię oraz aktualny repertuar seansów specjalnych, ` +
    `retrospektyw i klasyki filmowej na dużym ekranie.`;

  return bindOrphans(`${first} ${second}`);
};
