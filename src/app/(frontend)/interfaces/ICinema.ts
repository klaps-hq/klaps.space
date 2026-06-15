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
  // The cinema's listing on Filmweb (the catalog's source).
  filmwebUrl: string;
  // The cinema's own official website; null when unknown.
  website: string | null;
}

export interface ICinemaGroup {
  city: ICity;
  cinemas: Omit<ICinemaSummary, "city">[];
}
