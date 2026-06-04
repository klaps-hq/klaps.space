import React from "react";
import Link from "next/link";
import { IMovie } from "@/interfaces/IMovies";
import MoviePoster from "@/components/common/movie-poster";
import NoMoviePoster from "@/components/common/no-movie-poster";
import { formatDatePL, formatDuration, formatNames } from "@/lib/utils";
import MovieSectionHeading from "./movie-section-heading";

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
      <MovieSectionHeading eyebrow="Szczegóły filmu" title="O filmie" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 px-6 md:px-12 lg:px-16 border-t border-white/10 pt-12 md:pt-16 pb-16 md:pb-24">
        <div className="lg:col-span-3">
          <div className="aspect-[2/3] w-full max-w-[260px] overflow-hidden bg-white/5">
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

        <div className="lg:col-span-9 flex flex-col gap-12 md:gap-16">
          {credits.length > 0 && (
            <div className="flex flex-col">
              <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-white/40">
                Twórcy i obsada
              </p>
              <dl className="flex flex-col">
                {credits.map((item) => (
                  <div
                    key={item.label}
                    className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-1 sm:gap-8 border-t border-white/10 py-5"
                  >
                    <dt className="text-[10px] uppercase tracking-[0.25em] text-white/40 sm:pt-1">
                      {item.label}
                    </dt>
                    <dd className="text-base md:text-lg text-white leading-relaxed max-w-[70ch]">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {info.length > 0 && (
            <div className="flex flex-col">
              <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-white/40">
                Informacje
              </p>
              <dl className="grid grid-cols-2 md:grid-cols-3 gap-x-8 lg:gap-x-12">
                {info.map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col gap-1.5 border-t border-white/10 py-5"
                  >
                    <dt className="text-[10px] uppercase tracking-[0.25em] text-white/40">
                      {item.label}
                    </dt>
                    <dd className="text-base md:text-lg text-white leading-snug">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {movie.genres.length > 0 && (
            <div className="flex flex-col">
              <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-white/40">
                Gatunki
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {movie.genres.map((genre) => (
                  <Link
                    key={genre.id}
                    href={`/gatunki/${genre.slug}`}
                    className="inline-flex items-center px-4 h-9 text-[11px] uppercase tracking-wider border text-white/75 border-white/20 hover:text-white hover:border-white/60 transition-colors whitespace-nowrap"
                  >
                    {genre.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MovieDetailsSections;
