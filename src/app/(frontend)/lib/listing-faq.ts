import { IRecentScreening, IScreeningGroup } from "@/interfaces/IScreenings";
import { formatPlDate, inPlace, pluralPl } from "./seo";

/**
 * Data-driven FAQ entries for city and cinema pages. Every answer is built
 * from the live listing, so each page gets its own facts rather than a
 * shared template, and questions without data behind them are left out
 * instead of answered with filler.
 */
export interface FaqItem {
  q: string;
  a: string;
}

const MAX_NAMES = 4;
// Weekday patterns are noise below this many screenings.
const MIN_SCREENINGS_FOR_PATTERN = 5;

// "A, B i C"; longer lists end with "i inne" after MAX_NAMES.
const joinNames = (names: string[]): string => {
  const shown = names.slice(0, MAX_NAMES);
  if (names.length > MAX_NAMES) return `${shown.join(", ")} i inne`;
  if (shown.length <= 1) return shown.join("");
  return `${shown.slice(0, -1).join(", ")} i ${shown.at(-1)}`;
};

const quoted = (titles: string[]): string[] => titles.map((t) => `„${t}”`);

const countScreenings = (groups: IScreeningGroup[]): number =>
  groups.reduce((sum, group) => sum + group.screenings.length, 0);

const repertoireSummary = (groups: IScreeningGroup[]): string => {
  const screenings = countScreenings(groups);
  return `${groups.length} ${pluralPl(groups.length, "film", "filmy", "filmów")} i ${screenings} ${pluralPl(screenings, "nadchodzący seans", "nadchodzące seanse", "nadchodzących seansów")}, m.in. ${joinNames(quoted(groups.map((g) => g.movie.title)))}`;
};

// "29 października": the API date is a Warsaw calendar date, read as UTC
// so no zone shift moves it to the neighbouring day.
const formatDayMonth = (isoDate: string): string =>
  new Date(`${isoDate}T00:00:00Z`).toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });

// Plural weekday names, as in "w piątki i soboty".
const WEEKDAYS_PLURAL = [
  "niedziele",
  "poniedziałki",
  "wtorki",
  "środy",
  "czwartki",
  "piątki",
  "soboty",
];

interface CityFaqInput {
  /** Locative city name, e.g. "Krakowie". */
  cityLocative: string;
  independentNames: string[];
  chainNames: string[];
  screenings: IScreeningGroup[];
  lastUpdated: Date | null;
}

export const buildCityFaq = ({
  cityLocative,
  independentNames,
  chainNames,
  screenings,
  lastUpdated,
}: CityFaqInput): FaqItem[] => {
  const place = inPlace(cityLocative);
  const questions: FaqItem[] = [];
  const total = independentNames.length + chainNames.length;

  if (total > 0) {
    // "jest 1 kino", "są 3 kina", "jest 5 kin": the verb follows the numeral.
    const parts = [
      `W serwisie klaps.space ${pluralPl(total, "jest", "są", "jest")} ${total} ${pluralPl(total, "kino", "kina", "kin")} ${place}.`,
    ];
    if (independentNames.length > 0) {
      const label =
        independentNames.length === 1 ? "Kino studyjne" : "Kina studyjne";
      parts.push(`${label}: ${joinNames(independentNames)}.`);
    }
    if (chainNames.length > 0) {
      parts.push(
        chainNames.length === 1
          ? `Seanse specjalne gra też kino sieciowe ${chainNames[0]}.`
          : `Seanse specjalne grają też kina sieciowe: ${joinNames(chainNames)}.`
      );
    }
    questions.push({
      q: `Ile kin studyjnych jest ${place}?`,
      a: parts.join(" "),
    });
  }

  if (screenings.length > 0) {
    questions.push({
      q: `Co grają teraz kina studyjne ${place}?`,
      a: `W repertuarze: ${repertoireSummary(screenings)}.`,
    });
  }

  const byCinema = new Map<string, { screenings: number; movies: number }>();
  for (const group of screenings) {
    const seen = new Set<string>();
    for (const { cinema } of group.screenings) {
      const entry = byCinema.get(cinema.name) ?? { screenings: 0, movies: 0 };
      entry.screenings += 1;
      if (!seen.has(cinema.name)) entry.movies += 1;
      seen.add(cinema.name);
      byCinema.set(cinema.name, entry);
    }
  }
  if (byCinema.size >= 2) {
    const [name, top] = [...byCinema.entries()].sort(
      (a, b) => b[1].screenings - a[1].screenings
    )[0];
    questions.push({
      q: `Które kino ${place} ma najwięcej seansów specjalnych?`,
      a: `Najwięcej nadchodzących seansów ma ${name}: ${top.screenings} ${pluralPl(top.screenings, "seans", "seanse", "seansów")}, ${top.movies} ${pluralPl(top.movies, "film", "filmy", "filmów")}.`,
    });
  }

  if (total > 0 && lastUpdated) {
    questions.push({
      q: `Jak często aktualizowany jest repertuar kin ${place}?`,
      a: `Repertuar sprawdzamy codziennie i dopisujemy nowe seanse, gdy tylko kina je ogłoszą. Ostatnia zmiana repertuaru ${place}: ${formatPlDate(lastUpdated)}.`,
    });
  }

  return questions;
};

interface CinemaFaqInput {
  cinemaName: string;
  street: string | null;
  cityName: string;
  /** Locative city name, e.g. "Krakowie". */
  cityLocative: string;
  screenings: IScreeningGroup[];
  recent: IRecentScreening[];
  siblingNames: string[];
}

// Questions keep the venue name in the nominative ("Co gra teraz Kino
// Pod Baranami?"): API names arrive in the nominative and many already
// start with "Kino", so a declined "w kinie X" form would read wrong.
export const buildCinemaFaq = ({
  cinemaName,
  street,
  cityName,
  cityLocative,
  screenings,
  recent,
  siblingNames,
}: CinemaFaqInput): FaqItem[] => {
  const place = inPlace(cityLocative);
  const questions: FaqItem[] = [];

  if (screenings.length > 0) {
    questions.push({
      q: `Co gra teraz ${cinemaName}?`,
      a: `W repertuarze: ${repertoireSummary(screenings)}.`,
    });

    const all = screenings
      .flatMap((group) =>
        group.screenings.map((screening) => ({ title: group.movie.title, screening }))
      )
      .sort((a, b) => a.screening.dateTime.localeCompare(b.screening.dateTime));
    const next = all[0];
    questions.push({
      q: `Kiedy jest najbliższy seans: ${cinemaName}?`,
      a: `Najbliższy zapowiedziany seans to „${next.title}”, ${formatDayMonth(next.screening.date)} o ${next.screening.time}.`,
    });

    if (all.length >= MIN_SCREENINGS_FOR_PATTERN) {
      const days = new Map<number, number>();
      const hours = new Map<string, number>();
      for (const { screening } of all) {
        const day = new Date(`${screening.date}T00:00:00Z`).getUTCDay();
        days.set(day, (days.get(day) ?? 0) + 1);
        hours.set(screening.time, (hours.get(screening.time) ?? 0) + 1);
      }
      const topDays = [...days.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
        .map(([day]) => WEEKDAYS_PLURAL[day]);
      const topHours = [...hours.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
        .map(([time]) => time);
      questions.push({
        q: `W jakie dni ${cinemaName} gra seanse specjalne?`,
        a: `Najwięcej nadchodzących seansów przypada na ${joinNames(topDays)}, najczęściej o ${joinNames(topHours)}.`,
      });
    }
  }

  if (recent.length > 0) {
    questions.push({
      q: `${cinemaName}: co było ostatnio w repertuarze?`,
      a: `W ostatnich tygodniach grane były m.in. ${joinNames(quoted(recent.map((r) => r.movie.title)))}.`,
    });
  }

  // Streets arrive in the nominative, often without "ul." ("Rynek Główny
  // 27"), so "przy {street}" would not decline; a plain address line does.
  const address = street
    ? `Adres: ${street}, ${cityName}.`
    : `${cinemaName} to kino ${place}.`;
  questions.push({
    q: `Gdzie znajduje się ${cinemaName}?`,
    a:
      siblingNames.length > 0
        ? `${address} W tym samym mieście seanse specjalne grają też: ${joinNames(siblingNames)}.`
        : address,
  });

  return questions;
};
