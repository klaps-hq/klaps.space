import { IMoviePerson } from "@/interfaces/IMovies";

// Descriptive alt texts for movie artwork, shaped like a caption:
// "Lśnienie (1980), reż. Stanley Kubrick, plakat". Image search matches on
// title, year and director, and screen readers get the same context a
// sighted visitor reads from the card around the image.

export type MovieImageKind = "plakat" | "kadr";

export interface MovieImageAltInput {
  title: string;
  productionYear?: number | null;
  directors?: Pick<IMoviePerson, "name">[] | null;
}

// Two names cover co-directed films ("Joel Coen i Ethan Coen") without
// turning an anthology's crew list into a paragraph.
const MAX_DIRECTORS = 2;

export const movieImageAlt = (
  movie: MovieImageAltInput,
  kind: MovieImageKind
): string => {
  const parts = [
    movie.productionYear ? `${movie.title} (${movie.productionYear})` : movie.title,
  ];

  const names = (movie.directors ?? [])
    .map((person) => person.name.trim())
    .filter(Boolean)
    .slice(0, MAX_DIRECTORS);
  if (names.length > 0) {
    parts.push(`reż. ${names.join(" i ")}`);
  }

  parts.push(kind);
  return parts.join(", ");
};

// Gender-neutral on purpose: the API does not say whether a person is a
// "reżyser" or a "reżyserka".
export const directorPhotoAlt = (name: string): string =>
  `${name}, zdjęcie portretowe`;
