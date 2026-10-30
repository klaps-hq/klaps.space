/** Movie as returned by the socials series endpoints. */
export interface IMonthStatsMovie {
  id: number;
  slug: string;
  title: string;
  titleOriginal: string;
  productionYear: number;
  description: string;
  duration: number | null;
  posterUrl: string | null;
  backdropUrl: string | null;
}

/**
 * "Klaps w liczbach": classic screenings (films at least 25 years old) in one
 * calendar month, from GET /socials/series/stats. The endpoint also sends
 * `alreadyPublished` for the Instagram bot; the site ignores it.
 */
export interface IMonthStats {
  /** YYYY-MM */
  month: string;
  screenings: number;
  cinemas: number;
  cities: number;
  topMovie: {
    movie: IMonthStatsMovie;
    screenings: number;
    cities: number;
  } | null;
  oldestMovie: IMonthStatsMovie | null;
  /** Most screened movies, top first (up to six). */
  highlights: IMonthStatsMovie[];
  /** Cities by screening count, top first (up to fifteen). */
  byCity: {
    name: string;
    slug: string;
    count: number;
    lat: number | null;
    lon: number | null;
  }[];
  /** Cinemas by screening count, top first (up to five). */
  topCinemas: { name: string; slug: string; city: string; count: number }[];
}
