import { IScreeningGroup } from "./IScreenings";
import { PaginatedResponse } from "./IMovies";

export interface ICity {
  id: number;
  slug: string;
  name: string;
  nameDeclinated: string;
  numberOfCinemas: number;
  description: string | null;
  /** Canonical lowercase name (e.g. "mazowieckie"); null when unknown. */
  voivodeship: string | null;
  updatedAt?: string | null;
}

export interface ICityDetails extends ICity {
  city: ICity;
  screenings: IScreeningGroup[] | PaginatedResponse<IScreeningGroup>;
}
