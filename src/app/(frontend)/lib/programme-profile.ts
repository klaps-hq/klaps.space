import { IProgrammeProfile } from "@/interfaces/IProgrammeProfile";
import { apiFetch } from "./client";
import { inMonth } from "./month-stats";
import { inPlace, pluralPl, wPrep } from "./seo";
import { isChainCinema } from "./cinema-chains";

export interface ProgrammeProfileScope {
  cinemaSlug?: string;
  citySlug?: string;
  genreSlug?: string;
  directorSlug?: string;
  movieSlug?: string;
}

/** Below this many past screenings the section is not rendered at all. */
export const MIN_PROFILE_SCREENINGS = 3;
// Weekday and time-of-day patterns are noise below this many screenings.
// At 8, a small venue with 12 screenings got a weekday chart reading
// "pn: 0, wt: 4" and a sentence about its "usual" days, generated-looking
// filler on hundreds of near-identical pages.
export const MIN_SCREENINGS_FOR_PATTERN = 20;
// Dubbing is worth a sentence only when it shapes the programme.
const MIN_DUBBED_SHARE = 0.25;

/**
 * Programme profile for one scope, or null on any failure (including
 * `next build`, which has no API, and an API that predates the endpoint):
 * the section is extra content, so a missing profile only hides it.
 */
export const getProgrammeProfile = async (
  scope: ProgrammeProfileScope
): Promise<IProgrammeProfile | null> => {
  try {
    return await apiFetch<IProgrammeProfile>("/screenings/profile", {
      params: {
        cinemaSlug: scope.cinemaSlug ?? "",
        citySlug: scope.citySlug ?? "",
        genreSlug: scope.genreSlug ?? "",
        directorSlug: scope.directorSlug ?? "",
        movieSlug: scope.movieSlug ?? "",
      },
    });
  } catch (error) {
    console.warn("Programme profile unavailable:", error);
    return null;
  }
};

export const hasProfileContent = (
  profile: IProgrammeProfile | null
): profile is IProgrammeProfile =>
  profile !== null && profile.screenings >= MIN_PROFILE_SCREENINGS;

const MONTHS_GENITIVE = [
  "stycznia",
  "lutego",
  "marca",
  "kwietnia",
  "maja",
  "czerwca",
  "lipca",
  "sierpnia",
  "września",
  "października",
  "listopada",
  "grudnia",
];

/** "od marca 2026" from YYYY-MM-DD. */
export const sinceMonth = (isoDate: string): string =>
  `od ${MONTHS_GENITIVE[Number(isoDate.slice(5, 7)) - 1]} ${isoDate.slice(0, 4)}`;

// Plural weekday names, Monday first, as in "w piątki i soboty".
const WEEKDAYS_PLURAL = [
  "poniedziałki",
  "wtorki",
  "środy",
  "czwartki",
  "piątki",
  "soboty",
  "niedziele",
];

/** "z lat 70." for the 20th century, "z lat 2010-2019" afterwards. */
export const decadeLabel = (decade: number): string =>
  decade < 2000
    ? `z lat ${String(decade % 100).padStart(2, "0")}.`
    : `z lat ${decade}–${decade + 9}`;

/** "A, B i C". */
export const joinPl = (items: string[]): string =>
  items.length <= 1
    ? items.join("")
    : `${items.slice(0, -1).join(", ")} i ${items.at(-1)}`;

const lower = (name: string): string => name.toLocaleLowerCase("pl");

const capitalize = (text: string): string =>
  text ? `${text[0].toLocaleUpperCase("pl")}${text.slice(1)}` : text;

const screeningsPhrase = (count: number): string =>
  `${count} ${pluralPl(count, "seans", "seanse", "seansów")}`;

const percent = (part: number, whole: number): number =>
  Math.round((part / whole) * 100);

/** Profile cinemas without multiplex chains, in ranking order. */
export const studioCinemas = (profile: IProgrammeProfile) =>
  profile.topCinemas.filter((cinema) => !isChainCinema(cinema.name));

export type ProfileSubject =
  | { kind: "cinema" }
  | { kind: "city"; cityLocative: string }
  | { kind: "genre"; genreName: string }
  | { kind: "director"; directorName: string }
  | { kind: "movie" };

/**
 * Plain-language facts for the "w liczbach" section, built from the
 * profile only. Sentences are phrased without the subject as a grammatical
 * subject ("W programie...", "Najczęściej...") so no verb has to agree
 * with a venue name of unknown gender, and a sentence is left out when the
 * numbers behind it are too thin to say anything.
 */
export const buildProfileSentences = (
  profile: IProgrammeProfile,
  subject: ProfileSubject
): string[] => {
  const sentences: string[] = [];
  const total = profile.screenings;
  const films = `${profile.movies} ${pluralPl(profile.movies, "film", "filmy", "filmów")}`;
  const since = profile.since ? `${sinceMonth(profile.since)} ` : "";

  const venues = `${profile.cinemas} ${pluralPl(profile.cinemas, "kinie", "kinach", "kinach")}`;
  const cities =
    profile.cities > 1
      ? ` w ${profile.cities} ${pluralPl(profile.cities, "mieście", "miastach", "miastach")}`
      : "";
  const happened = `${pluralPl(total, "odbył się", "odbyły się", "odbyło się")} ${total} ${pluralPl(total, "seans specjalny", "seanse specjalne", "seansów specjalnych")}`;

  if (subject.kind === "cinema") {
    sentences.push(
      capitalize(
        `${since}w programie seansów specjalnych ${pluralPl(profile.movies, "znalazł się", "znalazły się", "znalazło się")} ${films}, ${pluralPl(profile.movies, "pokazany", "pokazane", "pokazanych")} łącznie ${total} ${pluralPl(total, "raz", "razy", "razy")}.`
      )
    );
  } else if (subject.kind === "city") {
    sentences.push(
      capitalize(
        `${since}${inPlace(subject.cityLocative)} ${happened} w ${venues}, łącznie ${films}.`
      )
    );
  } else if (subject.kind === "genre") {
    sentences.push(
      capitalize(
        `${since}w polskich kinach ${happened} z gatunku ${lower(subject.genreName)}: ${films} w ${venues}${cities}.`
      )
    );
  } else if (subject.kind === "movie") {
    sentences.push(
      capitalize(
        `${since}film pokazano w polskich kinach jako seans specjalny łącznie ${total} ${pluralPl(total, "raz", "razy", "razy")}, w ${venues}${cities}.`
      )
    );
  } else {
    // No director name here: a genitive form ("filmów Kieślowskiego") would
    // need declension data the API does not have.
    sentences.push(
      capitalize(
        `${since}w polskich kinach ${happened} z tej filmografii: ${films} w ${venues}${cities}.`
      )
    );
  }

  // Studio cinemas only: the city page is about them, and multiplexes,
  // which often top the raw count, already have their own pages.
  const studios = studioCinemas(profile);
  if (subject.kind === "city" && studios.length > 1) {
    const [first] = studios;
    sentences.push(
      `Wśród kin studyjnych najwięcej seansów specjalnych miało ${first.name}: ${screeningsPhrase(first.count)}, czyli ${percent(first.count, total)}% wszystkich w mieście.`
    );
  }
  if (
    (subject.kind === "genre" ||
      subject.kind === "director" ||
      subject.kind === "movie") &&
    profile.topCities.length > 1
  ) {
    sentences.push(
      `Najwięcej tych seansów było w miastach: ${joinPl(profile.topCities.slice(0, 3).map((c) => c.name))}.`
    );
  }

  if (
    subject.kind !== "director" &&
    subject.kind !== "movie" &&
    profile.topMovies.length > 0
  ) {
    const [top] = profile.topMovies;
    if (top.count > 1) {
      sentences.push(
        `Najczęściej grany tytuł to „${top.title}” (${top.productionYear}): ${screeningsPhrase(top.count)}.`
      );
    }
  }

  if (profile.oldestMovie && profile.movies > 1) {
    const topDecade = [...profile.decades].sort((a, b) => b.count - a.count)[0];
    // decadeLabel may already end with the ordinal dot ("lat 70.").
    const decadePart =
      topDecade && profile.decades.length > 1
        ? ` Najwięcej seansów dotyczyło filmów ${decadeLabel(topDecade.decade)}`.replace(/\.?$/, ".")
        : "";
    sentences.push(
      `Najstarszy pokazany film to „${profile.oldestMovie.title}” z ${profile.oldestMovie.productionYear} roku.${decadePart}`
    );
  }

  if (subject.kind !== "genre" && profile.topGenres.length >= 2) {
    sentences.push(
      `Dominujące gatunki: ${joinPl(profile.topGenres.slice(0, 3).map((g) => lower(g.name)))}.`
    );
  }

  if (subject.kind !== "director" && profile.topDirectors.length > 0) {
    const repeated = profile.topDirectors.filter((d) => d.count > 1);
    if (repeated.length > 0) {
      const names = repeated.slice(0, 3).map((d) => d.name);
      sentences.push(
        names.length === 1
          ? `Reżyser, którego filmy wracały najczęściej: ${names[0]}.`
          : `Reżyserzy, których filmy wracały najczęściej: ${joinPl(names)}.`
      );
    }
  }

  if (total >= MIN_SCREENINGS_FOR_PATTERN) {
    const days = profile.weekdays
      .map((count, index) => ({ count, index }))
      .filter((d) => d.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 2)
      .map((d) => WEEKDAYS_PLURAL[d.index]);
    const { morning, afternoon, evening } = profile.timeOfDay;
    const time =
      evening >= afternoon && evening >= morning
        ? "wieczorem"
        : afternoon >= morning
          ? "po południu"
          : "przed południem";
    sentences.push(
      `Seanse wypadają najczęściej ${wPrep(days[0])} ${joinPl(days)}, przeważnie ${time}.`
    );
  }

  if (profile.busiestMonth && profile.monthsActive > 1) {
    sentences.push(
      `Najwięcej seansów było ${inMonth(profile.busiestMonth.month)}: ${profile.busiestMonth.count}.`
    );
  }

  if (profile.dubbed / total >= MIN_DUBBED_SHARE) {
    sentences.push(
      `${percent(profile.dubbed, total)}% seansów to wersje z polskim dubbingiem.`
    );
  }

  return sentences;
};
