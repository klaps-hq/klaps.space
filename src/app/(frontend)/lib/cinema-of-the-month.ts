import { IMonthStats } from "@/interfaces/IMonthStats";
import { isChainCinema } from "./cinema-chains";
import {
  capitalize,
  currentMonth,
  FIRST_STATS_MONTH,
  isValidMonth,
  monthName,
  monthPath,
} from "./month-stats";
import { SITE_URL } from "./site-config";

/**
 * "Kino klasyki miesiąca": every finished month the independent cinemas with
 * the most classic screenings get an embeddable SVG badge with their place,
 * linking back to that month's stats page.
 */

export const CINEMA_OF_THE_MONTH_LIMIT = 5;

export type BadgeTheme = "dark" | "light";

export const BADGE_THEMES: BadgeTheme[] = ["dark", "light"];

export const CINEMA_BADGE_WIDTH = 264;
export const CINEMA_BADGE_HEIGHT = 64;

export interface CinemaOfTheMonth {
  /** Competition ranking: equal counts share a place (1, 2, 2, 4). */
  rank: number;
  slug: string;
  name: string;
  city: string;
  count: number;
}

/** Only finished months award the badge; the current one still changes. */
export const isFinishedStatsMonth = (month: string): boolean =>
  isValidMonth(month) && month >= FIRST_STATS_MONTH && month < currentMonth();

/**
 * Top independent cinemas of the month. The API ranks all venues, chains
 * included, and returns five, so after dropping multiplexes the list can be
 * shorter than the limit.
 */
export const getCinemasOfTheMonth = (stats: IMonthStats): CinemaOfTheMonth[] => {
  const independent = stats.topCinemas
    .filter((cinema) => !isChainCinema(cinema.name))
    .slice(0, CINEMA_OF_THE_MONTH_LIMIT);
  return independent.map((cinema) => ({
    ...cinema,
    rank: independent.findIndex((other) => other.count === cinema.count) + 1,
  }));
};

export const cinemaBadgePath = (
  month: string,
  slug: string,
  theme: BadgeTheme
): string =>
  `/odznaki/kino-miesiaca/${month}/${slug}.svg${theme === "light" ? "?theme=light" : ""}`;

const escapeXml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

/** Alt text and link title: the anchor text search engines read. */
const badgeAlt = (month: string, rank: number): string =>
  `Kino klasyki miesiąca, ${monthName(month)}: ${rank}. miejsce w zestawieniu klaps.space`;

/**
 * The snippet a cinema pastes into its site. It links to the month's stats
 * page, where the ranking and the method behind it are public.
 */
export const buildCinemaBadgeSnippet = (
  month: string,
  cinema: CinemaOfTheMonth,
  theme: BadgeTheme
): string => {
  const alt = escapeXml(badgeAlt(month, cinema.rank));
  return `<a href="${SITE_URL}${monthPath(month)}" title="${alt}"><img src="${SITE_URL}${cinemaBadgePath(month, cinema.slug, theme)}" alt="${alt}" width="${CINEMA_BADGE_WIDTH}" height="${CINEMA_BADGE_HEIGHT}"></a>`;
};

/**
 * Static SVG in the style of the general /badges files: no scripts, no
 * external resources, system fonts only (an <img> cannot load web fonts).
 * The cinema name stays out of the artwork, it only goes into the label.
 */
export const buildCinemaBadgeSvg = (
  month: string,
  cinema: CinemaOfTheMonth,
  theme: BadgeTheme
): string => {
  const bg = theme === "dark" ? "#000000" : "#ffffff";
  const fg = theme === "dark" ? "#ffffff" : "#000000";
  const label = escapeXml(
    `${cinema.name}: kino klasyki miesiąca, ${monthName(month)}, ${cinema.rank}. miejsce na klaps.space`
  );
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${CINEMA_BADGE_WIDTH}" height="${CINEMA_BADGE_HEIGHT}" viewBox="0 0 ${CINEMA_BADGE_WIDTH} ${CINEMA_BADGE_HEIGHT}" role="img" aria-label="${label}">
  <title>${label}</title>
  <rect x="0.5" y="0.5" width="263" height="63" fill="${bg}" stroke="${fg}" stroke-opacity="0.25"/>
  <polygon points="15,28 39,21 39,43 15,36" fill="${fg}"/>
  <line x1="52.5" y1="14" x2="52.5" y2="50" stroke="${fg}" stroke-opacity="0.2"/>
  <line x1="212.5" y1="14" x2="212.5" y2="50" stroke="${fg}" stroke-opacity="0.2"/>
  <g font-family="Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif" fill="${fg}">
    <text x="64" y="22" font-size="8" letter-spacing="1.6" fill-opacity="0.6">KINO KLASYKI MIESIĄCA</text>
    <text x="64" y="39" font-size="15" font-weight="500" letter-spacing="-0.2">${escapeXml(capitalize(monthName(month)))}</text>
    <text x="64" y="52" font-size="8" letter-spacing="0.4" fill-opacity="0.5">klaps.space</text>
    <text x="239" y="22" font-size="7" letter-spacing="1.2" fill-opacity="0.6" text-anchor="middle">MIEJSCE</text>
    <text x="238" y="46" font-size="24" font-weight="500" letter-spacing="-0.5" text-anchor="middle">${cinema.rank}</text>
  </g>
</svg>
`;
};
