import { ICity } from "./ICities";
import { ICinemaSummary } from "./ICinema";

export interface ISearchResults {
  cities: ICity[];
  cinemas: ICinemaSummary[];
}
