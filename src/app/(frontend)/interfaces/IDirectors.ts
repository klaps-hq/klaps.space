type DirectorRole = "director" | "actor" | "screenwriter";

export interface IDirector {
  id: number;
  /** Canonical, stable slug. */
  slug: string;
  name: string;
  /** TMDB person id. */
  sourceId: number;
  /** Currently always "director". */
  role: DirectorRole;
  bio: string | null;
  photoUrl: string | null;
  /** Screenings dated today or later. */
  upcomingScreeningsCount: number;
  /**
   * Upcoming screenings outside chain multiplexes; what the index threshold
   * counts. Absent on API versions before October 2026.
   */
  upcomingIndependentScreeningsCount?: number;
  moviesCount: number;
  /** ISO 8601 UTC. */
  updatedAt: string | null;
}
