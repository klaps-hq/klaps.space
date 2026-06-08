export type DirectorRole = "director" | "actor" | "screenwriter";

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
  moviesCount: number;
  /** ISO 8601 UTC. */
  updatedAt: string | null;
}
