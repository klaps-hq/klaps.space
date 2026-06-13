import { ICity } from "./ICities";

export interface ICinemaSummary {
  id: number;
  slug: string;
  name: string;
  street: string | null;
  city: ICity;
  // Optional: present when the API includes coordinates; consumed by
  // ScreeningEvent JSON-LD (location.geo) on movie pages.
  latitude?: number | null;
  longitude?: number | null;
  updatedAt?: string | null;
}

export interface ICinema {
  id: number;
  slug: string;
  name: string;
  street: string | null;
  city: ICity;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  sourceUrl: string;
}

export interface ICinemaGroup {
  city: ICity;
  cinemas: Omit<ICinemaSummary, "city">[];
}
