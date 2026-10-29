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
  // Open-air venue (summer cinema series); absent on older API responses.
  isOpenAir?: boolean;
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
  // Researched venue details; absent on older API responses.
  details?: ICinemaDetails;
}

export interface ICinemaRoom {
  name: string;
  seats: number | null;
}

export interface ICinemaAccessibility {
  wheelchair: boolean | null;
  hearingLoop: boolean | null;
  note: string | null;
}

// Freely licensed photo (Wikimedia Commons) with its attribution.
export interface ICinemaPhoto {
  url: string;
  sourceUrl: string;
  author: string;
  license: string;
  licenseUrl: string | null;
}

export interface ICinemaDetails {
  phone: string | null;
  repertoireUrl: string | null;
  bookingUrl: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  operator: { name: string; url: string | null } | null;
  screens: number | null;
  rooms: ICinemaRoom[];
  accessibility: ICinemaAccessibility | null;
  logoUrl: string | null;
  photos: ICinemaPhoto[];
}

export interface ICinemaGroup {
  city: ICity;
  cinemas: Omit<ICinemaSummary, "city">[];
}
