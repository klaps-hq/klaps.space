import { isChainCinema } from "./cinema-chains";

export { isDirectorIndexable } from "./directors";

/**
 * One indexability rule per entity type, shared by the page's robots meta,
 * the sitemap and every hub that links to the page (KLA-59).
 *
 * The sitemap lists come from the API's /sitemap endpoint, which applies the
 * same rules in SQL (api.klaps.space src/sitemap/sitemap.repository.ts). The
 * pages cannot read that list without lagging behind it by the sitemap's
 * cache window, so they evaluate the rule on their own data instead, and the
 * hubs, which have no per-entity data, read the API list through
 * getIndexableSlugs. Any change here has to land in the API as well.
 */

interface MovieIndexabilityInput {
  /** Upcoming screenings; only the venue name is read. */
  upcoming: ReadonlyArray<{ cinema: { name: string } }>;
  /** Venues where the film played in the last RECENT_SCREENINGS_DAYS days. */
  recentVenues: ReadonlyArray<{ cinema: { name: string } }>;
}

const hasIndependentVenue = (
  items: ReadonlyArray<{ cinema: { name: string } }>
): boolean => items.some((item) => !isChainCinema(item.cinema.name));

/**
 * Whether a movie has an upcoming screening in an independent cinema.
 * When it does, the page is indexable without looking at past screenings.
 */
export const hasIndependentUpcoming = (
  upcoming: MovieIndexabilityInput["upcoming"]
): boolean => hasIndependentVenue(upcoming);

/**
 * A movie page is indexable while it has an upcoming or recent (last 90
 * days) screening in an independent cinema. Mirrors the API's
 * hasRecentOrUpcomingIndependentScreening, which builds the film sitemap.
 *
 * Chain screenings do not count: a film that only plays in multiplexes
 * (reissues of Rocky or Interstellar at Cinema City) is not what the site is
 * about, and the API already kept such films out of the sitemap. The page
 * used to count every screening, so 21 chain-only films rendered as
 * indexable while the sitemap left them out (KLA-59).
 */
export const isMovieIndexable = ({
  upcoming,
  recentVenues,
}: MovieIndexabilityInput): boolean =>
  hasIndependentVenue(upcoming) || hasIndependentVenue(recentVenues);
