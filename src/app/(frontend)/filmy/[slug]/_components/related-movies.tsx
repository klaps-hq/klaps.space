import React from "react";
import Link from "next/link";
import { IMovieSummary } from "@/interfaces/IMovies";
import MoviePoster from "@/components/common/movie-poster";

interface RelatedMoviesProps {
  movies: IMovieSummary[];
}

const RelatedMovies: React.FC<RelatedMoviesProps> = ({ movies }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-10">
      {movies.map((movie) => (
        <Link
          key={movie.id}
          href={`/filmy/${movie.slug}`}
          className="group flex flex-col gap-3"
          aria-label={`Przejdź do filmu: ${movie.title}`}
        >
          <div className="relative aspect-[2/3] overflow-hidden bg-white/5">
            {movie.posterUrl ? (
              <MoviePoster
                posterUrl={movie.posterUrl}
                title={movie.title}
                width={400}
                height={600}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-white/30 text-[10px] uppercase tracking-[0.25em]">
                Bez plakatu
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1.5 min-w-0">
            <h3 className="text-base md:text-lg lg:text-xl font-semibold uppercase leading-tight tracking-tight text-white line-clamp-2 group-hover:text-white/90">
              {movie.title}
            </h3>
            {(movie.productionYear || movie.genres.length > 0) && (
              <div className="text-[11px] md:text-xs uppercase tracking-[0.18em] text-white/45 truncate">
                {movie.productionYear && <span>{movie.productionYear}</span>}
                {movie.productionYear && movie.genres.length > 0 && (
                  <span aria-hidden="true"> · </span>
                )}
                {movie.genres.length > 0 && <span>{movie.genres[0].name}</span>}
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default RelatedMovies;
