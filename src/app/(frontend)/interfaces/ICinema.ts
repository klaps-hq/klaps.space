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
  // Venue details; only on city-filtered cinema lists.
  details?: ICinemaDetails;
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
  // Open-air venue (summer cinema series); absent on older API responses.
  isOpenAir?: boolean;
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
  // Missing before the API started returning it: Commons.
  source?: "commons" | "website";
  license: string | null;
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
