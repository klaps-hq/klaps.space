import { IScreening, IScreeningGroup } from "@/interfaces/IScreenings";
import { wallTimeToInstant } from "./warsaw-time";

export interface ScreeningGroupFilters {
  genreIds?: number[];
  cityId?: number | null;
  voivodeship?: string | null;
  dateFrom?: string | null;
  dateTo?: string | null;
  search?: string | null;
}

export const parseGenreIdsParam = (raw: string | null): number[] => {
  if (!raw) return [];
  return raw
    .split(",")
    .map((v) => Number(v.trim()))
    .filter((v) => !Number.isNaN(v));
};

// Recompute the per-movie summary after narrowing screenings,
// so counters like "+N więcej" stay accurate.
const rebuildGroup = (
  group: IScreeningGroup,
  screenings: IScreening[]
): IScreeningGroup => ({
  ...group,
  screenings,
  summary: {
    screeningsCount: screenings.length,
    cinemasCount: new Set(screenings.map((s) => s.cinema.id)).size,
    citiesCount: new Set(screenings.map((s) => s.cinema.city.id)).size,
    cities: [...new Set(screenings.map((s) => s.cinema.city.name))],
  },
});

/**
 * Client-side counterpart of the server-side screenings filters.
 * Listing pages are statically cached (ISR) with the full data set
 * and narrow it here based on the URL params / preferred city.
 *
 * Genre and search match on the whole group (movie-level); city,
 * voivodeship and date range narrow the screenings within a group
 * and drop groups that end up empty.
 */
export const filterScreeningGroups = (
  groups: IScreeningGroup[],
  filters: ScreeningGroupFilters
): IScreeningGroup[] => {
  const genreIds = filters.genreIds ?? [];
  const search = filters.search?.trim().toLowerCase() ?? "";
  const { cityId, voivodeship, dateFrom, dateTo } = filters;
  const narrows =
    cityId != null ||
    voivodeship != null ||
    Boolean(dateFrom) ||
    Boolean(dateTo);

  return groups
    .filter((group) => {
      if (
        genreIds.length > 0 &&
        !group.movie.genres.some((g) => genreIds.includes(g.id))
      ) {
        return false;
      }
      if (search) {
        const haystack = [group.movie.title, group.movie.titleOriginal]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(search)) return false;
      }
      return true;
    })
    .map((group) => {
      if (!narrows) return group;
      // Dates are ISO "YYYY-MM-DD" strings, safe to compare lexically.
      const screenings = group.screenings.filter(
        (s) =>
          (cityId == null || s.cinema.city.id === cityId) &&
          (voivodeship == null ||
            s.cinema.city.voivodeship === voivodeship) &&
          (!dateFrom || s.date >= dateFrom) &&
          (!dateTo || s.date <= dateTo)
      );
      return rebuildGroup(group, screenings);
    })
    .filter((group) => group.screenings.length > 0);
};

/**
 * True once the screening has started. The API returns the whole current
 * day (from midnight), and cached pages outlive their data, so listings
 * would otherwise keep showing showtimes that are already over.
 */
const hasScreeningStarted = (
  screening: Pick<IScreening, "dateTime">,
  now: number
): boolean => wallTimeToInstant(screening.dateTime).getTime() <= now;

/** Screenings that have not started yet, relative to `now` (epoch ms). */
export const dropPastScreenings = <T extends Pick<IScreening, "dateTime">>(
  screenings: T[],
  now: number = Date.now()
): T[] => screenings.filter((s) => !hasScreeningStarted(s, now));

/**
 * The group narrowed to upcoming screenings, with its summary recomputed,
 * or null when nothing upcoming is left. Returns the same object when no
 * screening was dropped, so memoized consumers do not re-render.
 */
export const upcomingScreeningGroup = (
  group: IScreeningGroup,
  now: number = Date.now()
): IScreeningGroup | null => {
  const screenings = dropPastScreenings(group.screenings, now);
  if (screenings.length === group.screenings.length) return group;
  if (screenings.length === 0) return null;
  return rebuildGroup(group, screenings);
};

/** upcomingScreeningGroup over a list, dropping groups with nothing left. */
export const dropPastScreeningGroups = (
  groups: IScreeningGroup[],
  now: number = Date.now()
): IScreeningGroup[] =>
  groups.flatMap((group) => upcomingScreeningGroup(group, now) ?? []);
