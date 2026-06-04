import React from "react";
import Link from "next/link";
import { IMovie } from "@/interfaces/IMovies";
import { formatDatePL, formatDuration, formatNames } from "@/lib/utils";
import { pluralPl } from "@/lib/seo";

interface CreditItem {
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
  const premierePL = formatDatePL(movie.polishPremiereDate);

  const credits: CreditItem[] = [
    { label: "Reżyseria", value: directors ?? "" },
    { label: "Scenariusz", value: scriptwriters ?? "" },
  ].filter((i) => i.value.trim() !== "");

  const metaParts = [
    movie.productionYear?.toString(),
    movie.duration ? formatDuration(movie.duration) : null,
    countries,
    movie.language?.toUpperCase(),
    premierePL ? `Premiera w Polsce ${premierePL}` : null,
  ].filter(Boolean) as string[];

  if (credits.length === 0 && !actors && metaParts.length === 0) return null;

  const userRating = movie.ratings?.users;

  return (
    <div className="flex flex-col gap-10 md:gap-12">
      {(credits.length > 0 || actors || userRating) && (
        <div className="flex flex-col gap-8 md:gap-10">
          <div className="flex flex-col md:flex-row md:flex-wrap gap-8 md:gap-x-20 lg:gap-x-28">
            {credits.map((item) => (
              <div key={item.label} className="flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-[0.25em] text-white/40">
                  {item.label}
                </span>
                <span className="text-xl md:text-2xl text-white -tracking-[0.01em] leading-snug">
                  {item.value}
                </span>
              </div>
            ))}
            {userRating && userRating.votes > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-[0.25em] text-white/40">
                  Ocena widzów
                </span>
                <span className="text-xl md:text-2xl text-white -tracking-[0.01em] leading-snug">
                  {userRating.score.toLocaleString("pl-PL", {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  })}
                  <span className="text-white/40"> / 10</span>
                  <span className="ml-3 text-xs md:text-sm text-white/45 tracking-normal">
                    {userRating.votes.toLocaleString("pl-PL")}{" "}
                    {pluralPl(userRating.votes, "głos", "głosy", "głosów")}
                  </span>
                </span>
              </div>
            )}
          </div>
          {actors && (
            <div className="flex flex-col gap-2">
              <span className="text-[10px] uppercase tracking-[0.25em] text-white/40">
                Obsada
              </span>
              <span className="text-lg md:text-xl text-white/85 leading-relaxed max-w-[75ch]">
                {actors}
              </span>
            </div>
          )}
        </div>
      )}

      {metaParts.length > 0 && (
        <p className="text-xs md:text-sm uppercase tracking-[0.22em] text-white/50 leading-loose">
          {metaParts.join("  ·  ")}
        </p>
      )}

      {movie.genres.length > 0 && (
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
      )}
    </div>
  );
};

export default MovieAbout;
