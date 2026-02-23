import React from "react";
import { IMovie } from "@/interfaces/IMovies";
import { formatDatePL, formatDuration, formatNames } from "@/lib/utils";
import MovieDetailsGroup from "./movie-details-group";
import MovieGenreLinks from "./movie-genre-links";

type MovieDetailsSectionsProps = {
  movie: IMovie;
};

type MovieDetailItem = {
  label: string;
  value: string;
};

const MovieDetailsSections: React.FC<MovieDetailsSectionsProps> = ({
  movie,
}) => {
  const directors = formatNames(movie.directors);
  const actors = formatNames(movie.actors);
  const scriptwriters = formatNames(movie.scriptwriters ?? movie.screenwriters);
  const countries = formatNames(movie.countries ?? movie.countryOfOrigin);

  const credits: MovieDetailItem[] = [
    { label: "Rezyser", value: directors ?? "" },
    { label: "Aktorzy", value: actors ?? "" },
    { label: "Autorzy scenariusza", value: scriptwriters ?? "" },
  ];

  const movieInfo: MovieDetailItem[] = [
    { label: "Rok produkcji", value: movie.productionYear.toString() },
    {
      label: "Czas trwania",
      value: formatDuration(movie.duration),
    },
    { label: "Kraj pochodzenia", value: countries ?? "" },
    { label: "Jezyk", value: movie.language?.toUpperCase() ?? "" },
    {
      label: "Premiera swiatowa",
      value: formatDatePL(movie.worldPremiereDate),
    },
    {
      label: "Premiera w Polsce",
      value: formatDatePL(movie.polishPremiereDate),
    },
  ];

  if (credits.length === 0 && movieInfo.length === 0) return null;

  return (
    <section className="flex flex-col gap-10">
      <MovieDetailsGroup title="Tworcy i obsada" items={credits} />
      <MovieGenreLinks genres={movie.genres} />
      <MovieDetailsGroup title="Informacje o filmie" items={movieInfo} />
    </section>
  );
};

export default MovieDetailsSections;
