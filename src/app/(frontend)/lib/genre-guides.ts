import guides from "./genre-guides.json";
import type { FaqItem } from "./listing-faq";

/**
 * Researched editorial copy for genre pages: an intro under the H1, a long
 * guide (history, Polish tradition, the genre on the big screen) and an
 * evergreen FAQ. Written once from sources (scripts/genre-guides), so it
 * holds nothing time-bound; live numbers come from the programme profile.
 */
export interface GenreGuide {
  slug: string;
  intro: string;
  /** Plain paragraphs separated by blank lines. */
  guide: string;
  faq: FaqItem[];
}

/**
 * Grammatical forms of a genre for copy. API names are partly adjectives
 * ("Wojenny") or abbreviations ("Film TV"), so "Filmy z gatunku wojenny" or
 * "Wojenny na seansach specjalnych" read as broken Polish. Every genre
 * template goes through these forms instead of the raw name.
 */
export interface GenreForms {
  /** Plural noun phrase, capitalized: "Filmy wojenne", "Dramaty". */
  plural: string;
  /** Genitive plural, lowercase: "filmów wojennych", "dramatów". */
  genitive: string;
  /** Singular label for lists, lowercase: "film wojenny", "dramat". */
  label: string;
}

// The plural doubles as the searched-for name in titles and the guide
// heading ("Filmy dokumentalne w kinie").
const GENRE_FORMS: Record<string, GenreForms> = {
  akcja: {
    plural: "Filmy akcji",
    genitive: "filmów akcji",
    label: "kino akcji",
  },
  animacja: {
    plural: "Animacje",
    genitive: "animacji",
    label: "animacja",
  },
  dokumentalny: {
    plural: "Filmy dokumentalne",
    genitive: "filmów dokumentalnych",
    label: "dokument",
  },
  dramat: {
    plural: "Dramaty",
    genitive: "dramatów",
    label: "dramat",
  },
  familijny: {
    plural: "Filmy familijne",
    genitive: "filmów familijnych",
    label: "kino familijne",
  },
  fantasy: {
    plural: "Filmy fantasy",
    genitive: "filmów fantasy",
    label: "fantasy",
  },
  "film-tv": {
    plural: "Filmy telewizyjne",
    genitive: "filmów telewizyjnych",
    label: "film telewizyjny",
  },
  historyczny: {
    plural: "Filmy historyczne",
    genitive: "filmów historycznych",
    label: "film historyczny",
  },
  horror: {
    plural: "Horrory",
    genitive: "horrorów",
    label: "horror",
  },
  komedia: {
    plural: "Komedie",
    genitive: "komedii",
    label: "komedia",
  },
  kryminal: {
    plural: "Kryminały",
    genitive: "kryminałów",
    label: "kryminał",
  },
  muzyczny: {
    plural: "Filmy muzyczne",
    genitive: "filmów muzycznych",
    label: "film muzyczny",
  },
  przygodowy: {
    plural: "Filmy przygodowe",
    genitive: "filmów przygodowych",
    label: "film przygodowy",
  },
  romans: {
    plural: "Romanse",
    genitive: "romansów",
    label: "romans",
  },
  "sci-fi": {
    plural: "Filmy sci-fi",
    genitive: "filmów sci-fi",
    label: "sci-fi",
  },
  tajemnica: {
    plural: "Filmy z tajemnicą",
    genitive: "filmów z tajemnicą",
    label: "kino tajemnicy",
  },
  thriller: {
    plural: "Thrillery",
    genitive: "thrillerów",
    label: "thriller",
  },
  wojenny: {
    plural: "Filmy wojenne",
    genitive: "filmów wojennych",
    label: "film wojenny",
  },
  western: {
    plural: "Westerny",
    genitive: "westernów",
    label: "western",
  },
};

/**
 * Forms for a genre, with a neutral fallback for a genre the map does not
 * know yet: "z gatunku: X" keeps the raw name grammatical whatever its form.
 */
export const getGenreForms = (slug: string, name: string): GenreForms => {
  const known = GENRE_FORMS[slug];
  if (known) return known;
  const lower = name.replace(/\s+/g, " ").trim().toLocaleLowerCase("pl");
  return {
    plural: `Filmy z gatunku: ${lower}`,
    genitive: `filmów z gatunku: ${lower}`,
    label: lower,
  };
};

/** Lowercase genre label for lists in prose ("dramat, film telewizyjny"). */
export const genreLabel = (slug: string, name: string): string =>
  getGenreForms(slug, name).label;

const GUIDES = new Map(
  (guides as GenreGuide[]).map((guide) => [guide.slug, guide])
);

export const getGenreGuide = (slug: string): GenreGuide | undefined =>
  GUIDES.get(slug);

export const genreSearchName = (slug: string, fallback: string): string =>
  GENRE_FORMS[slug]?.plural ?? fallback;
