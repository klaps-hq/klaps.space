import { IMovie, IMovieSummary } from "@/interfaces/IMovies";
import { IScreeningGroup } from "@/interfaces/IScreenings";
import { isChainCinema } from "./cinema-chains";

const RELATED_LIMIT = 6;

// Stable per-pair number in [0, 1): ties break differently on every movie
// page, so equally scored candidates do not stack up on the same few titles.
const pairHash = (a: string, b: string): number => {
  let h = 2166136261;
  for (const ch of `${a}|${b}`) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 2 ** 32;
};

/**
 * Up to six screening movies most like `movie`. Candidates come from the
 * screenings feed, so every pick has an indexable page.
 *
 * Taking the first six of the primary-genre feed put the same titles on
 * most movie pages (October 2026: one film on 17 of 30 sampled pages) and
 * matched a family animation to dramas. Scoring instead:
 * - genre overlap as Jaccard, so a candidate tagged with five genres no
 *   longer matches everything,
 * - closeness in production year (same decade counts most),
 * - playing in a city where this movie plays too,
 * - playing in an independent venue: a chain-only re-release scored as
 *   "similar" on genre and decade alone (Rocky next to Kiarostami).
 */
export const pickRelatedMovies = (
  movie: Pick<IMovie, "id" | "slug" | "productionYear" | "genres">,
  movieCityNames: ReadonlySet<string>,
  groups: IScreeningGroup[]
): IMovieSummary[] => {
  const genreIds = new Set(movie.genres.map((g) => g.id));

  return groups
    .filter((group) => group.movie.id !== movie.id)
    .map((group) => {
      const candidate = group.movie;
      const candidateGenres = new Set(candidate.genres.map((g) => g.id));
      const shared = [...candidateGenres].filter((id) => genreIds.has(id)).length;
      const union = new Set([...genreIds, ...candidateGenres]).size;
      const genreScore = union > 0 ? shared / union : 0;

      const yearGap = Math.abs(candidate.productionYear - movie.productionYear);
      const eraScore =
        Math.floor(candidate.productionYear / 10) ===
        Math.floor(movie.productionYear / 10)
          ? 1
          : Math.max(0, 1 - yearGap / 30);

      const sharesCity = group.summary.cities.some((name) =>
        movieCityNames.has(name)
      );
      const inIndependentVenue = group.screenings.some(
        (screening) => !isChainCinema(screening.cinema.name)
      );

      return {
        candidate,
        shared,
        score:
          genreScore * 4 +
          eraScore * 1.5 +
          (sharesCity ? 1 : 0) +
          (inIndependentVenue ? 1.5 : 0) +
          pairHash(movie.slug, candidate.slug) * 0.5,
      };
    })
    // Without a shared genre it is not "similar", whatever the era.
    .filter((entry) => entry.shared > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, RELATED_LIMIT)
    .map((entry) => entry.candidate);
};
