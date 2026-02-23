import { IScreeningGroup } from "./IScreenings";
import { PaginatedResponse } from "./IMovies";

export interface ICity {
  id: number;
  slug: string;
  name: string;
  nameDeclinated: string;
}

export interface ICityDetails extends ICity {
  city: ICity;
  screenings: IScreeningGroup[] | PaginatedResponse<IScreeningGroup>;
}
