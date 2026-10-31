"use client";

import React from "react";
import Link from "next/link";
import MoviePoster from "@/components/common/movie-poster";
import { useNow } from "@/hooks/use-now";
import {
  ICardGroup,
  screeningDate,
  screeningTime,
  upcomingCardGroup,
} from "@/lib/client-screenings";
import { formatDateLabel } from "@/lib/utils";

interface ScreeningCardProps {
  group: ICardGroup;
  // Set on the few cards above the fold: their poster is the LCP element,
  // and Next marks priority images eager with fetchpriority=high so the
  // browser stops discovering them only after layout.
  priority?: boolean;
}

const ScreeningCard: React.FC<ScreeningCardProps> = ({
  group,
  priority = false,
}) => {
  // Cached listing HTML can outlive its showtimes (ISR serves stale pages
  // while revalidating), so started screenings are dropped again here once
  // the client clock is known, and a movie with nothing left disappears.
  const now = useNow();
  const visibleGroup = now === null ? group : upcomingCardGroup(group, now);
  if (!visibleGroup) return null;

  const { movie, screenings } = visibleGroup;
  const upcoming = screenings.slice(0, 2);
  const remaining = screenings.length - upcoming.length;

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
            productionYear={movie.productionYear}
            width={400}
            height={600}
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 17vw, 10vw"
            priority={priority}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/50 text-[10px] uppercase tracking-[0.25em]">
            Bez plakatu
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1 min-w-0">
        <h3 className="text-xs md:text-sm font-semibold uppercase leading-tight tracking-tight text-white line-clamp-2 group-hover:text-white/90">
          {movie.title}
        </h3>
        {(movie.productionYear || movie.genres.length > 0) && (
          <div className="text-[9px] md:text-[10px] uppercase tracking-[0.18em] text-white/50 truncate">
            {movie.productionYear && <span>{movie.productionYear}</span>}
            {movie.productionYear && movie.genres.length > 0 && (
              <span aria-hidden="true"> · </span>
            )}
            {movie.genres.length > 0 && <span>{movie.genres[0].name}</span>}
          </div>
        )}
      </div>

      <div className="mt-1 flex flex-col gap-1 border-t border-white/10 pt-2.5">
        {/* Two cinemas in one city can share a showtime, so the rows are
            keyed by position; the list is static per render. */}
        {upcoming.map(([dateTime, city], index) => (
          <div
            key={index}
            className="flex items-baseline justify-between gap-2 text-[10px] md:text-[11px] uppercase tracking-wider min-w-0"
          >
            <span className="truncate min-w-0">
              <span className="text-white">{formatDateLabel(screeningDate(dateTime))}</span>
              <span className="mx-1 text-white/30" aria-hidden="true">
                ·
              </span>
              <span className="text-white/80">{screeningTime(dateTime)}</span>
            </span>
            <span className="text-white/50 truncate max-w-[55%] text-right shrink-0">
              {city}
            </span>
          </div>
        ))}
        {remaining > 0 && (
          <div className="text-[9px] md:text-[10px] uppercase tracking-[0.18em] text-white/50 mt-0.5">
            +{remaining} więcej
          </div>
        )}
      </div>
    </Link>
  );
};

export default ScreeningCard;
