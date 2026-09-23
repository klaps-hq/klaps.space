import { ICinemaSummary } from "./ICinema";
import { IMovieHero, IMovieSummary } from "./IMovies";

export interface IScreening {
  id: number;
  date: string;
  time: string;
  dateTime: string;
  isDubbing: boolean;
  isSubtitled: boolean;
  cinema: ICinemaSummary;
}

export interface IScreeningGroup {
  movie: IMovieSummary;
  summary: {
    screeningsCount: number;
    cinemasCount: number;
    citiesCount: number;
    cities: string[];
  };
  screenings: IScreening[];
}

export interface IScreeningDetail {
  movie: IMovieHero;
  screening: IScreening;
}

export interface IRandomScreening {
  movie: IMovieHero;
  screening: IScreening;
}

/** One film from GET /screenings/recent: shown here lately, not scheduled now. */
export interface IRecentScreening {
  movie: IMovieSummary;
  /** Wall-clock date of the most recent screening, YYYY-MM-DD. */
  lastScreeningDate: string;
  screeningsCount: number;
  /**
   * Scheduled anywhere in the next 30 days, i.e. the movie page is
   * indexable. Only these get a link.
   */
  hasUpcomingScreenings: boolean;
}
