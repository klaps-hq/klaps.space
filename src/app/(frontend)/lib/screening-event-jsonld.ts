import { SITE_URL } from "./site-config";

// Shared ScreeningEvent JSON-LD builder for the movie and cinema layouts.
// The movie page emits one event per screening across cinemas; the cinema
// page emits one event per screening across movies. Both shapes flatten
// into the same per-screening input.

export interface ScreeningEventMovie {
  title: string;
  slug: string;
  duration: number | null;
}

export interface ScreeningEventCinema {
  name: string;
  slug: string;
  street: string | null;
  cityName: string;
  latitude?: number | null;
  longitude?: number | null;
}

export interface ScreeningEventData {
  movie: ScreeningEventMovie;
  cinema: ScreeningEventCinema;
  dateTime: string;
}

// Keep the events payload reasonable - soonest screenings first.
export const MAX_JSONLD_EVENTS = 50;

const buildEvent = (
  data: ScreeningEventData,
  pageUrl: string
): Record<string, unknown> => {
  const { movie, cinema, dateTime } = data;

  const location: Record<string, unknown> = {
    "@type": "MovieTheater",
    name: cinema.name,
    address: {
      "@type": "PostalAddress",
      streetAddress: cinema.street ?? undefined,
      addressLocality: cinema.cityName,
      addressCountry: "PL",
    },
  };

  if (cinema.latitude != null && cinema.longitude != null) {
    location.geo = {
      "@type": "GeoCoordinates",
      latitude: cinema.latitude,
      longitude: cinema.longitude,
    };
  }

  const event: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "ScreeningEvent",
    name: `${movie.title} - seans w ${cinema.name}, ${cinema.cityName}`,
    startDate: dateTime,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    url: pageUrl,
    location,
    organizer: {
      "@type": "Organization",
      name: cinema.name,
      url: `${SITE_URL}/kina/${cinema.slug}`,
    },
    workPresented: {
      "@type": "Movie",
      name: movie.title,
      url: `${SITE_URL}/filmy/${movie.slug}`,
    },
  };

  if (movie.duration) {
    event.endDate = new Date(
      new Date(dateTime).getTime() + movie.duration * 60 * 1000
    ).toISOString();
  }

  return event;
};

/** Upcoming events only, soonest first, capped at MAX_JSONLD_EVENTS. */
export const buildScreeningEventsJsonLd = (
  items: ScreeningEventData[],
  pageUrl: string
): Record<string, unknown>[] => {
  const now = Date.now();

  return items
    .filter(({ dateTime }) => {
      const start = new Date(dateTime).getTime();
      return !Number.isNaN(start) && start >= now;
    })
    .sort((a, b) => a.dateTime.localeCompare(b.dateTime))
    .slice(0, MAX_JSONLD_EVENTS)
    .map((item) => buildEvent(item, pageUrl));
};
