import type { NextScreeningItem } from "@/components/common/next-screening";
import { IScreening, IScreeningGroup } from "@/interfaces/IScreenings";
import { SITE_URL } from "./site-config";
import { isChainCinema } from "./cinema-chains";

// Enough to survive showtimes passing while the ISR page is cached, and to
// find one in the visitor's city on a movie page, without shipping the
// whole repertoire to the client a second time.
const MAX_ITEMS = 40;

const byStart = (a: { dateTime: string }, b: { dateTime: string }) =>
  a.dateTime.localeCompare(b.dateTime);

const cinemaLocation = (cinema: IScreening["cinema"]): string =>
  [cinema.name, cinema.street, cinema.city.name].filter(Boolean).join(", ");

interface MovieRef {
  title: string;
  slug: string;
  duration: number | null;
}

/** Candidates for the "next screening" strip on a movie page. */
export const movieNextScreeningItems = (
  screenings: IScreening[],
  movie: MovieRef
): NextScreeningItem[] =>
  [...screenings]
    .sort(byStart)
    .slice(0, MAX_ITEMS)
    .map((s) => ({
      id: s.id,
      dateTime: s.dateTime,
      date: s.date,
      time: s.time,
      cityId: s.cinema.city.id,
      primary: s.cinema.name,
      // Chain venue pages are noindex, so they get no crawlable link.
      primaryHref: isChainCinema(s.cinema.name)
        ? null
        : `/kina/${s.cinema.slug}`,
      secondary: s.cinema.city.name,
      calendar: {
        title: `${movie.title} - ${s.cinema.name}`,
        location: cinemaLocation(s.cinema),
        url: `${SITE_URL}/filmy/${movie.slug}`,
        durationMinutes: movie.duration,
        fileSlug: movie.slug,
      },
    }));

/** Candidates for the "next screening" strip on a cinema page. */
export const cinemaNextScreeningItems = (
  groups: IScreeningGroup[]
): NextScreeningItem[] =>
  groups
    .flatMap((group) =>
      group.screenings.map((screening) => ({ movie: group.movie, screening }))
    )
    .sort((a, b) => byStart(a.screening, b.screening))
    .slice(0, MAX_ITEMS)
    .map(({ movie, screening: s }) => ({
      id: s.id,
      dateTime: s.dateTime,
      date: s.date,
      time: s.time,
      cityId: s.cinema.city.id,
      primary: movie.title,
      primaryHref: `/filmy/${movie.slug}`,
      secondary: null,
      calendar: {
        title: `${movie.title} - ${s.cinema.name}`,
        location: cinemaLocation(s.cinema),
        url: `${SITE_URL}/filmy/${movie.slug}`,
        durationMinutes: movie.duration ?? null,
        fileSlug: movie.slug,
      },
    }));
