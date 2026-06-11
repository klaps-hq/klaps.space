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

/**
 * Minimal city shape for the global CityProvider. It is serialized into the
 * RSC payload of every page, so heavy fields (description prose, slugs,
 * counters) must stay out of it.
 */
export type ICityOption = Pick<ICity, "id" | "name" | "voivodeship">;

export interface ICityDetails extends ICity {
  city: ICity;
  screenings: IScreeningGroup[] | PaginatedResponse<IScreeningGroup>;
}
