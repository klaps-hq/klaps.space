import React from "react";
import Link from "next/link";
import { IMovie } from "@/interfaces/IMovies";
import { formatDatePL, formatDuration, formatNames } from "@/lib/utils";

interface SpecItem {
  label: string;
  value: string;
}

interface MovieAboutProps {
  movie: IMovie;
}

const MovieAbout: React.FC<MovieAboutProps> = ({ movie }) => {
  const directors = formatNames(movie.directors);
  const scriptwriters = formatNames(movie.scriptwriters ?? movie.screenwriters);
  const actors = formatNames(movie.actors);
  const countries = formatNames(movie.countries ?? movie.countryOfOrigin);

  const specs: SpecItem[] = [
    { label: "Reżyseria", value: directors ?? "" },
    { label: "Scenariusz", value: scriptwriters ?? "" },
    { label: "Obsada", value: actors ?? "" },
    { label: "Rok produkcji", value: movie.productionYear?.toString() ?? "" },
    {
      label: "Czas trwania",
      value: movie.duration ? formatDuration(movie.duration) : "",
    },
    { label: "Kraj produkcji", value: countries ?? "" },
    {
      label: "Premiera w Polsce",
      value: formatDatePL(movie.polishPremiereDate) ?? "",
    },
  ].filter((i) => i.value.trim() !== "");

  if (specs.length === 0 && movie.genres.length === 0) return null;

  return (
    <dl className="flex flex-col border-b border-white/10">
      {specs.map((item) => (
        <div
          key={item.label}
          className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-1 sm:gap-8 border-t border-white/10 py-4 md:py-5"
        >
          <dt className="text-[10px] uppercase tracking-[0.25em] text-white/40 sm:pt-1">
            {item.label}
          </dt>
          <dd className="text-base md:text-lg text-white/85 leading-relaxed max-w-[70ch]">
            {item.value}
          </dd>
        </div>
      ))}

      {movie.genres.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-2 sm:gap-8 border-t border-white/10 py-4 md:py-5">
          <dt className="text-[10px] uppercase tracking-[0.25em] text-white/40 sm:pt-2">
            Gatunki
          </dt>
          <dd className="flex flex-wrap items-center gap-2">
            {movie.genres.map((genre) => (
              <Link
                key={genre.id}
                href={`/gatunki/${genre.slug}`}
                className="inline-flex items-center px-3.5 h-8 text-[10px] uppercase tracking-wider border text-white/75 border-white/20 hover:text-white hover:border-white/60 transition-colors whitespace-nowrap"
              >
                {genre.name}
              </Link>
            ))}
          </dd>
        </div>
      )}
    </dl>
  );
};

export default MovieAbout;
