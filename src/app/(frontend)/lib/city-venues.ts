import { ICinemaDetails } from "@/interfaces/ICinema";
import { pluralPl } from "./seo";

export interface CityVenue {
  slug: string;
  name: string;
  details?: ICinemaDetails;
}

export interface CityVenueRow {
  slug: string;
  name: string;
  operator: string | null;
  screens: number | null;
  /** Total seats, only when every room's count is known. */
  seats: number | null;
  wheelchair: boolean;
  hearingLoop: boolean;
}

export interface LargestRoom {
  cinemaSlug: string;
  cinemaName: string;
  roomName: string;
  seats: number;
}

export interface CityVenueSummary {
  rows: CityVenueRow[];
  /** Venues whose number of screens is known, and their screens in total. */
  venuesWithScreens: number;
  screens: number;
  /** Venues whose every room has a seat count, and their seats in total. */
  venuesWithSeats: number;
  seats: number;
  largest: LargestRoom | null;
  wheelchair: string[];
  hearingLoop: string[];
  withBooking: number;
}

const seatsOf = (details: ICinemaDetails): number | null =>
  details.rooms.length > 0 && details.rooms.every((room) => room.seats !== null)
    ? details.rooms.reduce((sum, room) => sum + (room.seats ?? 0), 0)
    : null;

/**
 * Facts about a city's independent venues aggregated from the researched
 * cinema details: rooms, seats, accessibility. Every figure counts only the
 * venues that publish it, so the copy built from it never guesses.
 */
export const summarizeCityVenues = (venues: CityVenue[]): CityVenueSummary => {
  const rows: CityVenueRow[] = venues.map(({ slug, name, details }) => ({
    slug,
    name,
    operator: details?.operator?.name ?? null,
    screens: details ? (details.screens ?? (details.rooms.length || null)) : null,
    seats: details ? seatsOf(details) : null,
    wheelchair: details?.accessibility?.wheelchair === true,
    hearingLoop: details?.accessibility?.hearingLoop === true,
  }));

  let largest: LargestRoom | null = null;
  for (const { slug, name, details } of venues) {
    for (const room of details?.rooms ?? []) {
      if (room.seats !== null && (!largest || room.seats > largest.seats)) {
        largest = {
          cinemaSlug: slug,
          cinemaName: name,
          roomName: room.name,
          seats: room.seats,
        };
      }
    }
  }

  const withScreens = rows.filter((row) => row.screens !== null);
  const withSeats = rows.filter((row) => row.seats !== null);
  return {
    rows,
    venuesWithScreens: withScreens.length,
    screens: withScreens.reduce((sum, row) => sum + (row.screens ?? 0), 0),
    venuesWithSeats: withSeats.length,
    seats: withSeats.reduce((sum, row) => sum + (row.seats ?? 0), 0),
    largest,
    wheelchair: rows.filter((row) => row.wheelchair).map((row) => row.name),
    hearingLoop: rows.filter((row) => row.hearingLoop).map((row) => row.name),
    withBooking: venues.filter((venue) => venue.details?.bookingUrl).length,
  };
};

export const hasVenueFacts = (summary: CityVenueSummary): boolean =>
  summary.venuesWithScreens > 0 ||
  summary.wheelchair.length > 0 ||
  summary.hearingLoop.length > 0;

export const seatsPl = (seats: number): string =>
  `${seats} ${pluralPl(seats, "miejsce", "miejsca", "miejsc")}`;

export const screensPl = (screens: number): string =>
  `${screens} ${pluralPl(screens, "sala", "sale", "sal")}`;

/** "Sala Gerard" stays as is, a bare "Gerard" reads better with the prefix. */
export const roomLabel = (name: string): string =>
  /^(sala|studio|scena)\b/i.test(name) ? name : `sala ${name}`;
