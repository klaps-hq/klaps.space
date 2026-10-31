import { IScreeningGroup } from "@/interfaces/IScreenings";
import { isChainCinema } from "./cinema-chains";
import { todayInPoland } from "./landing-pages";
import { FaqItem } from "./listing-faq";
import { fetchScreenings } from "./screenings";
import { inPlace, pluralPl } from "./seo";

/**
 * Seasonal landing page /swieta-w-kinie: where Christmas films play between
 * 1 December and 6 January. The page, the sitemap and the hub links decide
 * indexability through the helpers here, same as the other landing pages.
 *
 * Films are matched by title, not by id: most Christmas titles are not in
 * the database until a cinema schedules them (the scraper creates a movie
 * when its first screening shows up), so a list of ids would miss exactly
 * the re-releases the page is about.
 */

export const CHRISTMAS_PATH = "/swieta-w-kinie";

/**
 * Below this many screenings the page is noindex: with a handful of
 * showtimes it is a thin page, and in November it would be an empty one.
 * The listing usually fills up in the second half of November.
 */
export const CHRISTMAS_MIN_INDEXABLE_SCREENINGS = 10;

interface ChristmasTitle {
  /** Sent to the API's search param, which matches title and original title. */
  term: string;
  /**
   * "exact" accepts only that title (Die Hard 3 is not a Christmas film),
   * "prefix" also accepts sequels and subtitles ("Listy do M. 2"),
   * "keyword" accepts the word anywhere in the title.
   */
  match: "exact" | "prefix" | "keyword";
}

// Polish and original titles, since a re-release may be listed under either.
// As of October 2026 only "Miasteczko Halloween" (miasteczko-halloween-1993)
// and "To właśnie miłość" (to-wlasnie-milosc-2003) exist in the database.
const CHRISTMAS_TITLES: ChristmasTitle[] = [
  { term: "Kevin sam w", match: "prefix" },
  { term: "Home Alone", match: "prefix" },
  { term: "Szklana pułapka", match: "exact" },
  { term: "Szklana pułapka 2", match: "exact" },
  { term: "Die Hard", match: "exact" },
  { term: "Die Hard 2", match: "exact" },
  { term: "To wspaniałe życie", match: "exact" },
  { term: "It's a Wonderful Life", match: "exact" },
  { term: "Grinch", match: "prefix" },
  { term: "The Grinch", match: "prefix" },
  { term: "Ekspres polarny", match: "exact" },
  { term: "The Polar Express", match: "exact" },
  { term: "Miasteczko Halloween", match: "exact" },
  { term: "To właśnie miłość", match: "exact" },
  { term: "Love Actually", match: "exact" },
  { term: "Holiday", match: "exact" },
  { term: "The Holiday", match: "exact" },
  { term: "Gremliny rozrabiają", match: "exact" },
  { term: "Gremlins", match: "exact" },
  { term: "Elf", match: "exact" },
  { term: "Wigilijny show", match: "exact" },
  { term: "Scrooged", match: "exact" },
  { term: "Listy do M", match: "prefix" },
  { term: "Klaus", match: "exact" },
  { term: "Cud na 34. ulicy", match: "exact" },
  { term: "Miracle on 34th Street", match: "exact" },
  { term: "Christmas", match: "keyword" },
  { term: "wigilij", match: "keyword" },
  { term: "Gwiazdk", match: "keyword" },
  { term: "świąteczn", match: "keyword" },
  { term: "Bożonarodzen", match: "keyword" },
];

// Keyword hits that are not about Christmas (Tati's "Jour de fête").
const EXCLUDED_SLUGS = new Set(["dzien-swiateczny-1949"]);

// Lowercase, no diacritics, punctuation as spaces: "Listy do M. 2" and
// "listy do m 2" compare equal, and "Świąt" matches "swiat".
const normalizeTitle = (value: string): string =>
  value
    .toLowerCase()
    .replace(/ł/g, "l")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const titleMatches = (title: string, entry: ChristmasTitle): boolean => {
  const normalized = normalizeTitle(title);
  const term = normalizeTitle(entry.term);
  if (entry.match === "exact") return normalized === term;
  if (entry.match === "prefix")
    return normalized === term || normalized.startsWith(`${term} `);
  return ` ${normalized}`.includes(` ${term}`);
};

/** True when a film counts as a Christmas film for this page. */
export const isChristmasMovie = (movie: {
  slug: string;
  title: string;
  titleOriginal: string | null;
}): boolean =>
  !EXCLUDED_SLUGS.has(movie.slug) &&
  CHRISTMAS_TITLES.some(
    (entry) =>
      titleMatches(movie.title, entry) ||
      (movie.titleOriginal !== null && titleMatches(movie.titleOriginal, entry))
  );

// === Season ===

export interface ChristmasSeason {
  /** The December year: the 2026 season runs to 6 January 2027. */
  year: number;
  /** YYYY-MM-DD, inclusive. */
  start: string;
  end: string;
}

/**
 * The season the page shows: until 6 January it is the one that started
 * the December before, from 7 January on the next one.
 */
export const getChristmasSeason = (today = todayInPoland()): ChristmasSeason => {
  const year = Number(today.slice(0, 4));
  const seasonYear = today <= `${year}-01-06` ? year - 1 : year;
  return {
    year: seasonYear,
    start: `${seasonYear}-12-01`,
    end: `${seasonYear + 1}-01-06`,
  };
};

/**
 * Christmas films with screenings in the season, from today on. One search
 * request per title rather than the whole feed: the season's feed is several
 * megabytes, the matches a few kilobytes. Throws when any request fails, so
 * the caller can tell a backend hiccup from an empty listing.
 */
export const fetchChristmasScreenings = async (
  season = getChristmasSeason(),
  today = todayInPoland()
): Promise<IScreeningGroup[]> => {
  const range = {
    dateFrom: today > season.start ? today : season.start,
    dateTo: season.end,
  };
  const results = await Promise.all(
    CHRISTMAS_TITLES.map((entry) =>
      fetchScreenings({ ...range, search: entry.term })
    )
  );

  const byMovie = new Map<number, IScreeningGroup>();
  for (const group of results.flat()) {
    if (!byMovie.has(group.movie.id) && isChristmasMovie(group.movie)) {
      byMovie.set(group.movie.id, group);
    }
  }
  return [...byMovie.values()].sort(
    (a, b) =>
      b.screenings.length - a.screenings.length ||
      a.movie.title.localeCompare(b.movie.title, "pl")
  );
};

// === Grouping: city -> cinema -> film -> showtimes ===

export interface ChristmasDay {
  /** YYYY-MM-DD */
  date: string;
  /** "18:30", Warsaw wall clock */
  times: string[];
}

export interface ChristmasFilm {
  slug: string;
  title: string;
  year: number;
  screenings: number;
  days: ChristmasDay[];
}

export interface ChristmasCinema {
  slug: string;
  name: string;
  isChain: boolean;
  screenings: number;
  films: ChristmasFilm[];
}

export interface ChristmasCity {
  slug: string;
  name: string;
  /** Locative, "Krakowie" */
  nameDeclinated: string;
  screenings: number;
  cinemas: ChristmasCinema[];
}

export interface ChristmasSummary {
  screenings: number;
  cinemas: number;
  cities: number;
  films: number;
  /** Most screened film, null when nothing is scheduled. */
  topFilm: { slug: string; title: string; screenings: number } | null;
}

// Accumulators for groupChristmasByCity; "slots" are "YYYY-MM-DDTHH:MM".
interface FilmAccumulator {
  film: Omit<ChristmasFilm, "days" | "screenings">;
  slots: string[];
}

interface CinemaAccumulator {
  cinema: Omit<ChristmasCinema, "films" | "screenings">;
  films: Map<string, FilmAccumulator>;
}

interface CityAccumulator {
  city: Omit<ChristmasCity, "cinemas" | "screenings">;
  cinemas: Map<string, CinemaAccumulator>;
}

const byScreeningsThenName =
  <T extends { screenings: number }>(name: (item: T) => string) =>
  (a: T, b: T): number =>
    b.screenings - a.screenings || name(a).localeCompare(name(b), "pl");

/**
 * Screening groups regrouped by place, on the server: the page renders
 * compact rows of dates and hours instead of shipping whole screening
 * objects. The API serializes Warsaw wall-clock times with a "Z" suffix,
 * so the date and hour are read verbatim from the string.
 */
export const groupChristmasByCity = (
  groups: IScreeningGroup[]
): ChristmasCity[] => {
  const cities = new Map<string, CityAccumulator>();

  for (const group of groups) {
    for (const screening of group.screenings) {
      const { cinema } = screening;
      const cityEntry = cities.get(cinema.city.slug) ?? {
        city: {
          slug: cinema.city.slug,
          name: cinema.city.name,
          nameDeclinated: cinema.city.nameDeclinated,
        },
        cinemas: new Map(),
      };
      cities.set(cinema.city.slug, cityEntry);

      const cinemaEntry = cityEntry.cinemas.get(cinema.slug) ?? {
        cinema: {
          slug: cinema.slug,
          name: cinema.name,
          isChain: isChainCinema(cinema.name),
        },
        films: new Map(),
      };
      cityEntry.cinemas.set(cinema.slug, cinemaEntry);

      const filmEntry = cinemaEntry.films.get(group.movie.slug) ?? {
        film: {
          slug: group.movie.slug,
          title: group.movie.title,
          year: group.movie.productionYear,
        },
        slots: [],
      };
      cinemaEntry.films.set(group.movie.slug, filmEntry);
      filmEntry.slots.push(screening.dateTime.slice(0, 16));
    }
  }

  return [...cities.values()]
    .map(({ city, cinemas }) => {
      const cinemaList = [...cinemas.values()]
        .map(({ cinema, films }) => {
          const filmList = [...films.values()]
            .map(({ film, slots }) => {
              const days = new Map<string, Set<string>>();
              for (const slot of [...slots].sort()) {
                const date = slot.slice(0, 10);
                const times = days.get(date) ?? new Set<string>();
                times.add(slot.slice(11, 16));
                days.set(date, times);
              }
              return {
                ...film,
                screenings: slots.length,
                days: [...days].map(([date, times]) => ({
                  date,
                  times: [...times],
                })),
              };
            })
            .sort(byScreeningsThenName((film) => film.title));
          return {
            ...cinema,
            screenings: filmList.reduce((sum, film) => sum + film.screenings, 0),
            films: filmList,
          };
        })
        // Independent venues first, same rule as the listings.
        .sort(
          (a, b) =>
            Number(a.isChain) - Number(b.isChain) ||
            byScreeningsThenName<ChristmasCinema>((cinema) => cinema.name)(a, b)
        );
      return {
        ...city,
        screenings: cinemaList.reduce((sum, cinema) => sum + cinema.screenings, 0),
        cinemas: cinemaList,
      };
    })
    .sort(byScreeningsThenName((city) => city.name));
};

export const summarizeChristmas = (
  groups: IScreeningGroup[]
): ChristmasSummary => {
  const screenings = groups.flatMap((group) => group.screenings);
  const top = groups[0];
  return {
    screenings: screenings.length,
    cinemas: new Set(screenings.map((s) => s.cinema.id)).size,
    cities: new Set(screenings.map((s) => s.cinema.city.id)).size,
    films: groups.length,
    topFilm: top
      ? {
          slug: top.movie.slug,
          title: top.movie.title,
          screenings: top.screenings.length,
        }
      : null,
  };
};

/** Index decision; null when the data could not be fetched. */
export const isChristmasIndexable = (
  groups: IScreeningGroup[] | null
): boolean | null =>
  groups === null
    ? null
    : summarizeChristmas(groups).screenings >= CHRISTMAS_MIN_INDEXABLE_SCREENINGS;

// === Copy ===

const DAY_NAMES = ["Nd", "Pn", "Wt", "Śr", "Cz", "Pt", "So"];

/** "2026-12-12" -> "So 12.12" */
export const formatChristmasDay = (date: string): string => {
  const [, month, day] = date.split("-");
  return `${DAY_NAMES[new Date(`${date}T00:00:00Z`).getUTCDay()]} ${day}.${month}`;
};

/** "1 grudnia 2026 do 6 stycznia 2027", for "od ..." */
export const seasonRangeLabel = (season: ChristmasSeason): string =>
  `1 grudnia ${season.year} do 6 stycznia ${season.year + 1}`;

const screeningsPl = (count: number): string =>
  `${count} ${pluralPl(count, "seans", "seanse", "seansów")}`;

const cinemasInPl = (count: number): string =>
  `${count} ${pluralPl(count, "kinie", "kinach", "kinach")}`;

const citiesInPl = (count: number): string =>
  `${count} ${pluralPl(count, "mieście", "miastach", "miastach")}`;

/** "N seansów w M kinach", the per-city meta line. */
export const cityMetaLine = (city: ChristmasCity): string =>
  `${screeningsPl(city.screenings)} w ${cinemasInPl(city.cinemas.length)}`;

/** Lead paragraph with the season's numbers, or the "not yet" note. */
export const christmasIntro = (
  summary: ChristmasSummary,
  season: ChristmasSeason
): string => {
  const lead = `Gdzie w okresie świątecznym obejrzeć na dużym ekranie „Kevina”, „Grincha” czy „To właśnie miłość”? Zbieramy seanse świątecznych hitów od ${seasonRangeLabel(season)}, z podziałem na miasta i kina.`;
  if (!summary.topFilm) {
    return `${lead} Kina publikują grudniowy repertuar zwykle w drugiej połowie listopada, a ta strona uzupełnia się sama co godzinę.`;
  }
  // Noun-led, so no verb has to agree with the title's grammatical number.
  return `${lead} Na teraz: ${screeningsPl(summary.screenings)} w ${cinemasInPl(summary.cinemas)} w ${citiesInPl(summary.cities)}, ${summary.films} ${pluralPl(summary.films, "tytuł", "tytuły", "tytułów")} w repertuarze. Najczęściej grany tytuł: „${summary.topFilm.title}” (${screeningsPl(summary.topFilm.screenings)}).`;
};

const MAX_LISTED = 4;

const joinPl = (items: string[]): string => {
  const shown = items.slice(0, MAX_LISTED);
  if (items.length > MAX_LISTED) return `${shown.join(", ")} i inne`;
  if (shown.length <= 1) return shown.join("");
  return `${shown.slice(0, -1).join(", ")} i ${shown.at(-1)}`;
};

const isKevin = (movie: { title: string; titleOriginal: string | null }) =>
  [movie.title, movie.titleOriginal ?? ""].some(
    (title) =>
      titleMatches(title, { term: "Kevin sam w", match: "prefix" }) ||
      titleMatches(title, { term: "Home Alone", match: "prefix" })
  );

/**
 * Data-driven FAQ: answers come from the live listing, and the license
 * answer matches the note on /w-liczbach.
 */
export const christmasFaq = (
  groups: IScreeningGroup[],
  cities: ChristmasCity[],
  summary: ChristmasSummary,
  season: ChristmasSeason
): FaqItem[] => {
  const range = seasonRangeLabel(season);
  const kevin = groups.filter((group) => isKevin(group.movie));
  const kevinScreenings = kevin.flatMap((group) => group.screenings);
  const kevinCities = new Set(kevinScreenings.map((s) => s.cinema.city.id)).size;

  return [
    {
      q: `Gdzie obejrzeć filmy świąteczne w kinie w grudniu ${season.year}?`,
      a:
        cities.length > 0
          ? `Od ${range} świąteczne hity grają kina w ${citiesInPl(summary.cities)}, najwięcej seansów ${joinPl(cities.slice(0, 3).map((city) => inPlace(city.nameDeclinated)))}. Na tej stronie każde miasto ma listę kin, filmów, dni i godzin seansów.`
          : `Kina nie opublikowały jeszcze repertuaru na okres od ${range}. Zwykle robią to w drugiej połowie listopada, a strona uzupełnia się sama co godzinę.`,
    },
    {
      q: "Jakie świąteczne filmy grają kina?",
      a:
        summary.topFilm
          ? `W zapowiedziach kin są teraz: ${joinPl(groups.map((g) => `„${g.movie.title}”`))}. Najczęściej grany tytuł: „${summary.topFilm.title}” (${screeningsPl(summary.topFilm.screenings)}).`
          : "Na razie żadne kino nie zapowiedziało seansów świątecznych hitów. Zestawienie obejmuje m.in. „Kevina samego w domu”, „To właśnie miłość” i „Miasteczko Halloween”, więc pojawią się tu, gdy tylko trafią do repertuarów.",
    },
    {
      q: "Czy „Kevin sam w domu” będzie w kinach?",
      a:
        kevinScreenings.length > 0
          ? `Tak, kina zapowiedziały już ${screeningsPl(kevinScreenings.length)} filmów o Kevinie w ${citiesInPl(kevinCities)}. Dni i godziny są na tej stronie, w sekcjach poszczególnych miast.`
          : "Na razie żadne kino nie zapowiedziało seansów „Kevina”. Jeśli pojawią się w repertuarze, trafią na tę stronę automatycznie.",
    },
    {
      q: "Które filmy uznajecie za świąteczne?",
      a: "Filmy, których akcja dzieje się w święta albo które co roku wracają w grudniu: m.in. „Kevin sam w domu”, „Grinch”, „Szklana pułapka”, „To wspaniałe życie”, „Ekspres polarny”, „To właśnie miłość”, „Holiday”, „Gremliny rozrabiają”, „Elf”, „Listy do M.” oraz tytuły z Wigilią, Gwiazdką lub Christmas w nazwie. Część z nich ma mniej niż 25 lat, dlatego to zestawienie świątecznych hitów, a nie klasyki.",
    },
    {
      q: "Gdzie zarezerwować miejsce na seans?",
      a: "Klaps nie prowadzi sprzedaży ani rezerwacji. Na stronie każdego kina w serwisie jest link do jego oficjalnej witryny, gdzie sprawdzisz szczegóły seansu i dostępność miejsc.",
    },
    {
      q: "Czy można cytować te dane?",
      a: "Tak. Dane udostępniamy na licencji CC BY 4.0: można je cytować i wykorzystywać z podaniem źródła: Klaps (klaps.space). Zestawienie aktualizujemy co godzinę.",
    },
  ];
};
