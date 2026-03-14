import { ICinemaSummary } from "./ICinema";
import { IMovieHero, IMovieSummary } from "./IMovies";

export interface IScreening {
  id: number;
  date: string;
  time: string;
  dateTime: string;
  ticketUrl: string | null;
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
