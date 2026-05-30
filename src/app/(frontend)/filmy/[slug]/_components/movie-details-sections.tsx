import React from "react";
import Link from "next/link";
import { IMovie } from "@/interfaces/IMovies";
import MoviePoster from "@/components/common/movie-poster";
import NoMoviePoster from "@/components/common/no-movie-poster";
import { formatDatePL, formatDuration, formatNames } from "@/lib/utils";

interface DetailItem {
  label: string;
  value: string;
}

interface MovieDetailsSectionsProps {
  movie: IMovie;
}

const MovieDetailsSections: React.FC<MovieDetailsSectionsProps> = ({
  movie,
}) => {
  const directors = formatNames(movie.directors);
  const actors = formatNames(movie.actors);
  const scriptwriters = formatNames(movie.scriptwriters ?? movie.screenwriters);
  const countries = formatNames(movie.countries ?? movie.countryOfOrigin);

  const credits: DetailItem[] = [
    { label: "Reżyseria", value: directors ?? "" },
    { label: "Scenariusz", value: scriptwriters ?? "" },
    { label: "Obsada", value: actors ?? "" },
  ].filter((i) => i.value.trim() !== "");

  const info: DetailItem[] = [
    {
      label: "Rok produkcji",
      value: movie.productionYear?.toString() ?? "",
    },
    {
      label: "Czas trwania",
      value: movie.duration ? formatDuration(movie.duration) : "",
    },
    { label: "Kraj produkcji", value: countries ?? "" },
    { label: "Język oryginału", value: movie.language?.toUpperCase() ?? "" },
    {
      label: "Premiera światowa",
      value: formatDatePL(movie.worldPremiereDate) ?? "",
    },
    {
      label: "Premiera w Polsce",
      value: formatDatePL(movie.polishPremiereDate) ?? "",
    },
  ].filter((i) => i.value.trim() !== "");

  if (credits.length === 0 && info.length === 0 && movie.genres.length === 0) {
    return null;
  }

  return (
    <section className="relative bg-black text-white border-t border-white/10">
      <div className="px-6 md:px-12 lg:px-16 pt-24 md:pt-32 pb-12 md:pb-16">
        <div className="mb-8 flex items-center gap-4 text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/50">
          <span className="h-px w-12 bg-white/30" aria-hidden="true" />
          <span>Szczegóły filmu</span>
        </div>
        <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold uppercase leading-[0.9] -tracking-[0.03em] text-white">
          O filmie
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr] gap-10 md:gap-12 lg:gap-20 px-6 md:px-12 lg:px-16 border-t border-white/10 pt-12 md:pt-16 pb-16 md:pb-24">
        <div className="w-full max-w-[280px] mx-auto md:mx-0">
          <div className="aspect-[2/3] overflow-hidden border border-white/10 bg-white/5">
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

        <div className="flex flex-col gap-12 md:gap-16">
          {credits.length > 0 && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-white/45">
                <span className="h-px w-6 bg-white/25" aria-hidden="true" />
                <span>Twórcy i obsada</span>
              </div>
              <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-7">
                {credits.map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col gap-2 border-l border-white/15 pl-4"
                  >
                    <dt className="text-[10px] uppercase tracking-[0.3em] text-white/40">
                      {item.label}
                    </dt>
                    <dd className="text-sm md:text-base text-white leading-relaxed">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {movie.genres.length > 0 && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-white/45">
                <span className="h-px w-6 bg-white/25" aria-hidden="true" />
                <span>Gatunki</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {movie.genres.map((genre) => (
                  <Link
                    key={genre.id}
                    href={`/gatunki/${genre.slug}`}
                    className="flex items-center gap-1.5 px-3 h-7 text-[11px] uppercase tracking-wider border bg-transparent text-white/70 border-white/15 hover:text-white hover:border-white/50 transition-colors whitespace-nowrap"
                  >
                    {genre.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {info.length > 0 && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-white/45">
                <span className="h-px w-6 bg-white/25" aria-hidden="true" />
                <span>Informacje</span>
              </div>
              <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-7">
                {info.map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col gap-2 border-l border-white/15 pl-4"
                  >
                    <dt className="text-[10px] uppercase tracking-[0.3em] text-white/40">
                      {item.label}
                    </dt>
                    <dd className="text-sm md:text-base text-white leading-relaxed">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MovieDetailsSections;
