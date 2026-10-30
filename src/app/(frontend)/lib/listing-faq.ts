import { IRecentScreening, IScreeningGroup } from "@/interfaces/IScreenings";
import { IProgrammeProfile } from "@/interfaces/IProgrammeProfile";
import { ICinemaDetails } from "@/interfaces/ICinema";
import {
  CityVenueSummary,
  roomLabel,
  screensPl,
  seatsPl,
} from "./city-venues";
import { formatPlDate, inPlace, pluralPl } from "./seo";
import { hasProfileContent, sinceMonth } from "./programme-profile";

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

/**
 * "What does this place usually show?" answered from screening history: the
 * most screened films and genres so far. Left out when the history is too
 * thin to say anything.
 */
const profileAnswer = (profile: IProgrammeProfile | null | undefined): string | null => {
  if (!profile || !hasProfileContent(profile)) return null;
  const films = profile.topMovies.slice(0, 3).map((m) => m.title);
  if (films.length === 0) return null;
  // Noun-led, so no verb has to agree with a title ("Auta" is plural,
  // "grany był „Auta”" read as broken Polish; content audit #4).
  const label =
    films.length === 1 ? "najczęściej grany tytuł" : "najczęściej grane tytuły";
  const lead = profile.since
    ? `${sinceMonth(profile.since).replace(/^o/, "O")} ${label}:`
    : `${label.charAt(0).toUpperCase()}${label.slice(1)}:`;
  const parts = [`${lead} ${joinNames(quoted(films))}.`];
  if (profile.topGenres.length >= 2) {
    parts.push(
      `Przeważają gatunki: ${joinNames(profile.topGenres.slice(0, 3).map((g) => g.name.toLocaleLowerCase("pl")))}.`
    );
  }
  parts.push(
    `Łącznie ${profile.screenings} ${pluralPl(profile.screenings, "seans", "seanse", "seansów")} i ${profile.movies} ${pluralPl(profile.movies, "film", "filmy", "filmów")}.`
  );
  return parts.join(" ");
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
  profile?: IProgrammeProfile | null;
  /** Rooms and accessibility of the year-round independent venues. */
  venues?: CityVenueSummary;
}

/** Venue comparison questions; each needs the data behind its answer. */
const cityVenuesFaq = (place: string, venues: CityVenueSummary): FaqItem[] => {
  const questions: FaqItem[] = [];
  const { largest } = venues;

  if (largest && venues.rows.length > 1) {
    questions.push({
      q: `Które kino studyjne ${place} ma największą salę?`,
      a: `Największa sala to ${roomLabel(largest.roomName)} w kinie ${largest.cinemaName}: ${seatsPl(largest.seats)}.`,
    });
  }

  if (venues.venuesWithScreens > 0) {
    const scope =
      venues.venuesWithScreens === venues.rows.length
        ? `Kina studyjne ${place} mają`
        : `Kina studyjne ${place}, które podają te dane (${venues.venuesWithScreens} z ${venues.rows.length}), mają`;
    const seats =
      venues.venuesWithSeats === venues.venuesWithScreens &&
      venues.venuesWithSeats > 0
        ? ` i ${seatsPl(venues.seats)}`
        : "";
    questions.push({
      q: `Ile sal mają kina studyjne ${place}?`,
      a: `${scope} łącznie ${screensPl(venues.screens)}${seats}.`,
    });
  }

  if (venues.wheelchair.length > 0 || venues.hearingLoop.length > 0) {
    const parts = [
      venues.wheelchair.length > 0 &&
        `Dostępność dla osób na wózkach deklarują: ${joinNames(venues.wheelchair)}.`,
      venues.hearingLoop.length > 0 &&
        `Pętlę indukcyjną ma: ${joinNames(venues.hearingLoop)}.`,
    ].filter(Boolean);
    questions.push({
      q: `Które kina ${place} są dostępne dla osób z niepełnosprawnościami?`,
      a: `${parts.join(" ")} Szczegóły są na stronach poszczególnych kin.`,
    });
  }

  return questions;
};

export const buildCityFaq = ({
  cityLocative,
  independentNames,
  chainNames,
  screenings,
  lastUpdated,
  profile,
  venues,
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

  const cityHistory = profileAnswer(profile);
  if (cityHistory) {
    questions.push({
      q: `Jakie filmy grają kina studyjne ${place}?`,
      a: cityHistory,
    });
  }

  if (venues) questions.push(...cityVenuesFaq(place, venues));

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
  profile?: IProgrammeProfile | null;
  /** Researched venue details; absent on older API responses. */
  details?: ICinemaDetails;
}

/** Venue facts (rooms, booking, accessibility, operator) as FAQ entries. */
const cinemaDetailsFaq = (
  cinemaName: string,
  details: ICinemaDetails | undefined
): FaqItem[] => {
  if (!details) return [];
  const questions: FaqItem[] = [];
  const { rooms, phone, bookingUrl, repertoireUrl, accessibility, operator } =
    details;
  const screens = details.screens ?? (rooms.length || null);

  if (screens !== null) {
    const known = rooms.filter((room) => room.seats !== null);
    const total =
      known.length === rooms.length && rooms.length > 0
        ? known.reduce((sum, room) => sum + (room.seats ?? 0), 0)
        : null;
    const largest = [...known].sort((a, b) => (b.seats ?? 0) - (a.seats ?? 0))[0];
    const parts = [
      `${cinemaName} ma ${screens} ${pluralPl(screens, "salę", "sale", "sal")}`,
      total !== null && screens > 1 ? `, łącznie ${seatsPl(total)}` : "",
      total !== null && screens === 1 ? ` na ${seatsPl(total)}` : "",
      ".",
      largest && total !== null && screens > 1
        ? ` Największa to ${largest.name} (${seatsPl(largest.seats ?? 0)}).`
        : "",
    ];
    questions.push({
      q: `Ile sal ma ${cinemaName}?`,
      a: parts.join(""),
    });
  }

  if (bookingUrl || phone) {
    const ways = [
      bookingUrl ? "online na stronie kina" : null,
      phone ? `telefonicznie pod numerem ${phone}` : null,
    ].filter(Boolean) as string[];
    questions.push({
      q: `${cinemaName}: jak zarezerwować miejsce na seans?`,
      a: `Miejsca można zarezerwować ${ways.join(" lub ")}.${
        repertoireUrl ? " Aktualne godziny seansów są też na stronie kina." : ""
      }`,
    });
  }

  if (accessibility) {
    const facts = [
      accessibility.wheelchair === true && "kino jest dostępne dla osób na wózkach",
      accessibility.wheelchair === false && "kino nie jest przystosowane dla osób na wózkach",
      accessibility.hearingLoop === true && "w kinie jest pętla indukcyjna",
    ].filter(Boolean) as string[];
    const lead = facts.length
      ? `${facts[0][0].toUpperCase()}${facts.join(", ").slice(1)}.`
      : "";
    const answer = [lead, accessibility.note].filter(Boolean).join(" ");
    if (answer) {
      questions.push({
        // Venue names vary in gender ("Muranów", "Kino Wisła"), so the
        // question avoids agreeing an adjective with the name.
        q: `${cinemaName}: czy kino jest dostępne dla osób z niepełnosprawnościami?`,
        a: answer,
      });
    }
  }

  if (operator) {
    questions.push({
      q: `Kto prowadzi ${cinemaName}?`,
      a: `Kino prowadzi ${operator.name}.`,
    });
  }

  return questions;
};

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
  profile,
  details,
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

  const cinemaHistory = profileAnswer(profile);
  if (cinemaHistory) {
    questions.push({
      q: `Jakie filmy pokazuje ${cinemaName}?`,
      a: cinemaHistory,
    });
  }

  questions.push(...cinemaDetailsFaq(cinemaName, details));

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
