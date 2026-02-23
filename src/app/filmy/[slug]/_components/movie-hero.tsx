import React from "react";
import { IMovie } from "@/interfaces/IMovies";
import MoviePoster from "@/components/common/movie-poster";
import NoMoviePoster from "@/components/common/no-movie-poster";
import MovieMeta from "@/app/(home)/_components/hero/movie-meta";

type MovieHeroProps = {
  movie: IMovie;
};

const MovieHero: React.FC<MovieHeroProps> = ({ movie }) => {

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col md:flex-row gap-8 md:gap-12">
        <div className="w-full max-w-[280px] mx-auto md:mx-0 md:w-80 shrink-0">
          <div className="aspect-2/3 overflow-hidden border border-white/10">
            {movie.posterUrl ? (
              <MoviePoster
                posterUrl={movie.posterUrl}
                title={movie.title}
                width={320}
                height={480}
                className="w-full h-full object-cover"
              />
            ) : (
              <NoMoviePoster className="w-full h-full" />
            )}
          </div>
        </div>

        <div className="flex flex-col gap-5 md:py-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-white text-3xl md:text-5xl font-bold uppercase tracking-wide leading-tight">
              {movie.title}
            </h1>

            {movie.titleOriginal && movie.titleOriginal !== movie.title && (
              <p className="text-neutral-500 text-base md:text-xl italic">
                {movie.titleOriginal}
              </p>
            )}
          </div>

          <MovieMeta
            duration={movie.duration}
            productionYear={movie.productionYear}
            genres={movie.genres}
            className="text-base md:text-lg"
          />

          {movie.description && (
            <p className="text-neutral-400 text-base md:text-lg leading-relaxed max-w-2xl">
              {movie.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieHero;
