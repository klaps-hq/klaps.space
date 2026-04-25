"use client";

import React from "react";
import Link from "next/link";
import { IScreeningGroup } from "@/interfaces/IScreenings";
import MoviePoster from "@/components/common/movie-poster";
import { formatDateLabel, formatDuration } from "@/lib/utils";

interface ScreeningCardProps {
  group: IScreeningGroup;
}

const ScreeningCard: React.FC<ScreeningCardProps> = ({ group }) => {
  const { movie, screenings, summary } = group;
  const upcoming = screenings.slice(0, 2);
  const remaining = Math.max(0, summary.screeningsCount - upcoming.length);

  return (
    <Link
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
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/30 text-[10px] uppercase tracking-[0.25em]">
            Bez plakatu
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute left-3 bottom-3 right-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <span className="inline-block text-[10px] uppercase tracking-[0.25em] text-white border-b border-white/70 pb-0.5">
            Zobacz film →
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <h3 className="text-sm md:text-base font-semibold uppercase leading-tight tracking-tight text-white line-clamp-2 group-hover:text-white/90">
          {movie.title}
        </h3>
        <div className="flex items-center gap-1.5 text-[9px] md:text-[10px] uppercase tracking-[0.18em] text-white/45">
          {movie.productionYear && <span>{movie.productionYear}</span>}
          {movie.productionYear && movie.duration && (
            <span aria-hidden="true">·</span>
          )}
          {movie.duration && <span>{formatDuration(movie.duration)}</span>}
          {movie.genres.length > 0 && (
            <>
              <span aria-hidden="true">·</span>
              <span className="truncate">{movie.genres[0].name}</span>
            </>
          )}
        </div>

        <div className="mt-1.5 flex flex-col gap-1 border-t border-white/10 pt-2.5">
          {upcoming.map((s) => (
            <div
              key={s.id}
              className="flex items-baseline justify-between gap-2 text-[10px] md:text-[11px] uppercase tracking-wider"
            >
              <span className="truncate">
                <span className="text-white">{formatDateLabel(s.date)}</span>
                <span className="mx-1 text-white/30" aria-hidden="true">
                  ·
                </span>
                <span className="text-white/80">{s.time}</span>
              </span>
              <span className="text-white/40 truncate max-w-[55%] text-right">
                {s.cinema.city.name}
              </span>
            </div>
          ))}
          {remaining > 0 && (
            <div className="text-[9px] md:text-[10px] uppercase tracking-[0.18em] text-white/40 mt-0.5">
              +{remaining} więcej
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ScreeningCard;
