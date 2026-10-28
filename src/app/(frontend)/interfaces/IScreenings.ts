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
  /** Scheduled anywhere in the next 30 days. */
  hasUpcomingScreenings: boolean;
}

/** One cinema from GET /screenings/recent-venues: where a film played lately. */
export interface IRecentVenue {
  cinema: {
    slug: string;
    name: string;
    city: { name: string; slug: string };
  };
  /** Wall-clock date of the film's most recent screening there, YYYY-MM-DD. */
  lastScreeningDate: string;
  screeningsCount: number;
}
