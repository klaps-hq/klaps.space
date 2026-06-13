import { SITE_URL } from "./site-config";
import { tmdbPhotoSrc } from "./tmdb";
import { wallTimeToInstant, wallTimeToWarsawIso } from "./warsaw-time";

// Shared ScreeningEvent JSON-LD builder for the movie and cinema layouts.
// The movie page emits one event per screening across cinemas; the cinema
// page emits one event per screening across movies. Both shapes flatten
// into the same per-screening input.

export interface ScreeningEventMovie {
  title: string;
  slug: string;
  duration: number | null;
  posterUrl: string | null;
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
const MAX_JSONLD_EVENTS = 50;

// Stable per-event URL fragment: Google prefers a unique url per event,
// and all events on a page would otherwise share the page URL, which
// risks them being deduplicated into one.
const eventFragment = (cinemaSlug: string, dateTime: string): string =>
  `#seans-${cinemaSlug}-${dateTime.slice(0, 16).replace(/[T:]/g, "-")}`;

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
    // image and description are recommended fields for Event rich results;
    // without them Search Console reports warnings on every event.
    description: `Seans filmu ${movie.title} w kinie ${cinema.name} w ${cinema.cityName}. Szczegóły pokazu i pełny repertuar na klaps.space.`,
    // The API's dateTime is Warsaw wall time with a misleading "Z";
    // keep the displayed hour and attach the real offset (see warsaw-time).
    startDate: wallTimeToWarsawIso(dateTime),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    url: `${pageUrl}${eventFragment(cinema.slug, dateTime)}`,
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

  // Same mirror-aware resolver as the Movie block: hotlinking the TMDB CDN
  // here would bypass the MinIO mirror and diverge from the visible images.
  const image = tmdbPhotoSrc(movie.posterUrl, "w780");
  if (image) {
    event.image = image;
  }

  if (movie.duration) {
    // Adding minutes to the pseudo instant keeps it in wall-time space.
    event.endDate = wallTimeToWarsawIso(
      new Date(new Date(dateTime).getTime() + movie.duration * 60 * 1000)
    );
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
      if (Number.isNaN(new Date(dateTime).getTime())) return false;
      // Compare real instants - the raw pseudo instant runs ahead of UTC
      // by the offset, which would keep already-started events for 1-2 h.
      return wallTimeToInstant(dateTime).getTime() >= now;
    })
    .sort((a, b) => a.dateTime.localeCompare(b.dateTime))
    .slice(0, MAX_JSONLD_EVENTS)
    .map((item) => buildEvent(item, pageUrl));
};
