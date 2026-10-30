import guides from "./genre-guides.json";
import { FaqItem } from "./listing-faq";

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

// Genre names in the API are partly adjectives ("Dokumentalny"), which do
// not read as a subject. These are the forms people search for, used in
// the title and the guide heading ("Filmy dokumentalne w kinie").
const SEARCH_NAMES: Record<string, string> = {
  akcja: "Kino akcji",
  animacja: "Animacje",
  dokumentalny: "Filmy dokumentalne",
  dramat: "Dramaty",
  familijny: "Filmy familijne",
  fantasy: "Filmy fantasy",
  "film-tv": "Filmy telewizyjne",
  historyczny: "Filmy historyczne",
  horror: "Horrory",
  komedia: "Komedie",
  kryminal: "Kryminały",
  muzyczny: "Filmy muzyczne",
  przygodowy: "Filmy przygodowe",
  romans: "Romanse",
  "sci-fi": "Filmy sci-fi",
  tajemnica: "Filmy z tajemnicą",
  thriller: "Thrillery",
  wojenny: "Filmy wojenne",
};

const GUIDES = new Map(
  (guides as GenreGuide[]).map((guide) => [guide.slug, guide])
);

export const getGenreGuide = (slug: string): GenreGuide | undefined =>
  GUIDES.get(slug);

export const genreSearchName = (slug: string, fallback: string): string =>
  SEARCH_NAMES[slug] ?? fallback;
