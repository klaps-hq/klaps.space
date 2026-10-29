/** A ranked entity in a programme profile: a genre, director, city, etc. */
export interface IProfileRanked {
  slug: string;
  name: string;
  count: number;
}

export interface IProfileCinema extends IProfileRanked {
  citySlug: string;
  cityName: string;
}

export interface IProfileMovie {
  slug: string;
  title: string;
  productionYear: number;
  count: number;
}

/**
 * What the programme of one cinema, city, genre or director has looked like
 * so far (GET /screenings/profile). Past screenings only; counts are
 * screenings unless the field says otherwise.
 */
export interface IProgrammeProfile {
  /** First and last past screening day, YYYY-MM-DD. */
  since: string | null;
  until: string | null;
  screenings: number;
  movies: number;
  cinemas: number;
  cities: number;
  monthsActive: number;
  busiestMonth: { month: string; count: number } | null;
  /** Screenings per weekday, Monday first. */
  weekdays: number[];
  timeOfDay: { morning: number; afternoon: number; evening: number };
  dubbed: number;
  decades: { decade: number; count: number }[];
  medianProductionYear: number | null;
  oldestMovie: { slug: string; title: string; productionYear: number } | null;
  topMovies: IProfileMovie[];
  topGenres: IProfileRanked[];
  topDirectors: IProfileRanked[];
  topCinemas: IProfileCinema[];
  topCities: IProfileRanked[];
}
