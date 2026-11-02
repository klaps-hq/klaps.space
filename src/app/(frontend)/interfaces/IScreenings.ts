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

/** The venue fields the film page's screenings list renders. */
export interface IMovieScreeningCinema {
  id: number;
  slug: string;
  name: string;
  street: string | null;
  city: { id: number; slug: string; name: string };
}

/** One screening as rendered by the film page's screenings list. */
export interface IMovieScreening {
  id: number;
  date: string;
  time: string;
  dateTime: string;
  cinema: IMovieScreeningCinema;
}

/** [id, dateTime, date, time, cinemaId] */
export type MovieScreeningTuple = [number, string, string, string, number];

/**
 * Film page screenings as sent to the client island: each venue once and
 * every screening as a tuple pointing at it. The full IScreening repeated
 * the venue and its city on every showtime, so a re-release with hundreds
 * of showtimes shipped most of its HTML as RSC payload.
 */
export interface IMovieScreeningsPayload {
  cinemas: IMovieScreeningCinema[];
  screenings: MovieScreeningTuple[];
}
