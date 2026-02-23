import React from "react";
import Link from "next/link";
import { IGenre } from "@/interfaces/IMovies";
import { cn, formatDuration } from "@/lib/utils";

const META_SEPARATOR = " · ";
const MAX_VISIBLE_GENRES = 2;
const GENRE_SEPARATOR = "/";

const defaultBuildGenreHref = (genre: IGenre) => `/gatunki/${genre.slug}`;

interface MovieMetaProps {
  duration: number | null;
  productionYear: number;
  genres: IGenre[];
  buildGenreHref?: (genre: IGenre) => string;
  className?: string;
}

const MovieMeta: React.FC<MovieMetaProps> = ({
  duration,
  productionYear,
  genres,
  buildGenreHref = defaultBuildGenreHref,
  className,
}) => {
  const durationText = duration ? formatDuration(duration) : null;
  const visibleGenres = genres.slice(0, MAX_VISIBLE_GENRES);
  const hasGenres = visibleGenres.length > 0;

  return (
    <div
      className={cn(
        "flex flex-wrap items-baseline gap-x-1 text-[#B3B3B3] text-xl font-light tracking-normal",
        className
      )}
    >
      {durationText && (
        <span className="font-medium text-[#B3B3B3]">{durationText}</span>
      )}
      {durationText && productionYear && <span>{META_SEPARATOR}</span>}
      {productionYear && <span>{productionYear}</span>}
      {productionYear && hasGenres && <span>{META_SEPARATOR}</span>}
      {hasGenres && (
        <span className="uppercase tracking-widest">
          {visibleGenres.map((genre, index) => (
            <React.Fragment key={genre.id}>
              <Link
                href={buildGenreHref(genre)}
                className="hover:text-blood-red transition-colors duration-200"
              >
                {genre.name}
              </Link>
              {index < visibleGenres.length - 1 && GENRE_SEPARATOR}
            </React.Fragment>
          ))}
        </span>
      )}
    </div>
  );
};

export default MovieMeta;
