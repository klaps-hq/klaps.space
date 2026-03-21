import React from "react";
import Link from "next/link";
import { IMovie } from "@/interfaces/IMovies";
import { formatNames, formatDuration, formatDatePL } from "@/lib/utils";

interface MovieMetaTableProps {
  movie: IMovie;
}

const MovieMetaTable: React.FC<MovieMetaTableProps> = ({ movie }) => {
  const items = [
    { label: "Rok", value: movie.productionYear.toString() },
    {
      label: "Kraj",
      value: formatNames(movie.countries ?? movie.countryOfOrigin),
    },
    { label: "Czas", value: formatDuration(movie.duration) },
    { label: "Język", value: movie.language },
    {
      label: "Premiera światowa",
      value: formatDatePL(movie.worldPremiereDate),
    },
    {
      label: "Premiera w Polsce",
      value: formatDatePL(movie.polishPremiereDate),
    },
  ].filter((item) => item.value) as { label: string; value: string }[];

  if (items.length === 0 && movie.genres.length === 0) return null;

  return (
    <div className="border-t border-white/10 h-full flex flex-col">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center justify-between py-3 border-b border-white/10 text-xs md:text-sm uppercase tracking-[0.12em]"
        >
          <span className="text-neutral-500">{item.label}</span>
          <span className="text-white font-semibold">{item.value}</span>
        </div>
      ))}

      {movie.genres.length > 0 && (
        <div className="flex items-center justify-between py-3 border-b border-white/10 text-xs md:text-sm uppercase tracking-[0.12em]">
          <span className="text-neutral-500">Gatunek</span>

          <div className="flex flex-wrap gap-x-1.5 justify-end">
            {movie.genres.map((genre, i) => (
              <span key={genre.id}>
                <Link
                  href={`/gatunki/${genre.slug}`}
                  className="text-white font-semibold hover:text-blood-red transition-colors"
                >
                  {genre.name}
                </Link>

                {i < movie.genres.length - 1 && (
                  <span className="text-neutral-500 ml-1">/</span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieMetaTable;
