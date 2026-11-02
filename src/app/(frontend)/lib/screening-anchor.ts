import { SITE_URL } from "./site-config";

// One id per screening, shared by the ScreeningEvent JSON-LD (@id and url)
// and the matching time chip on the film page, so the event URL fragment
// resolves to a real element. The dateTime is the API's Warsaw wall time,
// so its first 16 chars are the displayed date and hour.
export const screeningAnchorId = (
  cinemaSlug: string,
  dateTime: string
): string =>
  `seans-${cinemaSlug}-${dateTime.slice(0, 16).replace(/[T:]/g, "-")}`;

/**
 * Canonical URL of a screening: always the film page, where every
 * screening of the film is listed, so the film and cinema pages emit the
 * same ScreeningEvent node.
 */
export const screeningEventUrl = (
  movieSlug: string,
  cinemaSlug: string,
  dateTime: string
): string =>
  `${SITE_URL}/filmy/${movieSlug}#${screeningAnchorId(cinemaSlug, dateTime)}`;
