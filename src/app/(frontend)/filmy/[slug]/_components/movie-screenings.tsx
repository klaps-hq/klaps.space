"use client";

import React, { useState } from "react";
import Link from "next/link";
import { IScreening } from "@/interfaces/IScreenings";
import CityField from "@/app/(home)/_components/screenings/city-field";
import { groupScreeningsByCinema } from "@/lib/screenings";
import { formatDateLabel, cn } from "@/lib/utils";

interface MovieScreeningsProps {
  screenings: IScreening[];
}

interface ScreeningTimeProps {
  screening: IScreening;
}

const ScreeningTime: React.FC<ScreeningTimeProps> = ({ screening }) => {
  if (screening.ticketUrl) {
    return (
      <a
        href={screening.ticketUrl}
        target="_blank"
        rel="noreferrer noopener"
        className="inline-flex items-center justify-center h-9 px-4 text-xs font-medium tracking-[0.15em] tabular-nums border border-white/25 text-white hover:bg-white hover:text-black hover:border-white transition-colors"
      >
        {screening.time}
      </a>
    );
  }
  return (
    <span className="inline-flex items-center justify-center h-9 px-4 text-xs font-medium tracking-[0.15em] tabular-nums border border-white/10 text-white/50 cursor-default">
      {screening.time}
    </span>
  );
};

interface CinemaRowProps {
  screenings: IScreening[];
}

const CinemaRow: React.FC<CinemaRowProps> = ({ screenings }) => {
  const first = screenings[0];
  if (!first) return null;

  const sorted = [...screenings].sort((a, b) =>
    a.dateTime.localeCompare(b.dateTime)
  );

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-8 py-5 md:py-6">
      <div className="flex flex-col gap-1 min-w-0">
        <Link
          href={`/kina/${first.cinema.slug}`}
          className="w-fit text-xl md:text-2xl lg:text-3xl font-medium uppercase -tracking-[0.01em] leading-tight text-white hover:text-white/70 transition-colors"
        >
          {first.cinema.name}
        </Link>
        <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/45">
          {first.cinema.city.name}
          {first.cinema.street ? ` · ${first.cinema.street}` : ""}
        </span>
      </div>
      <div className="flex flex-wrap gap-2 md:justify-end shrink-0">
        {sorted.map((screening) => (
          <ScreeningTime key={screening.id} screening={screening} />
        ))}
      </div>
    </div>
  );
};

const MovieScreenings: React.FC<MovieScreeningsProps> = ({ screenings }) => {
  const availableDates = [...new Set(screenings.map((s) => s.date))].sort();
  const [selectedDate, setSelectedDate] = useState<string | null>(
    () => availableDates[0] ?? null
  );

  if (screenings.length === 0) {
    return (
      <div className="border-y border-white/10 py-20 md:py-28 flex flex-col items-center text-center gap-3">
        <p className="text-sm md:text-base text-white/55">
          Brak nadchodzących seansów.
        </p>
        <p className="text-[11px] uppercase tracking-[0.25em] text-white/35">
          Sprawdź ponownie później
        </p>
      </div>
    );
  }

  const visibleDates = selectedDate ? [selectedDate] : availableDates;

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pb-5 border-b border-white/10">
        {availableDates.map((date) => {
          const active = selectedDate === date;
          return (
            <button
              key={date}
              type="button"
              onClick={() => setSelectedDate(active ? null : date)}
              className={cn(
                "shrink-0 pb-1 text-[11px] uppercase tracking-wider border-b transition-colors whitespace-nowrap",
                active
                  ? "text-white border-white"
                  : "text-white/55 border-transparent hover:text-white hover:border-white/40"
              )}
            >
              {formatDateLabel(date)}
            </button>
          );
        })}
        <div className="ml-auto">
          <CityField />
        </div>
      </div>

      {visibleDates.map((date) => {
        const groups = groupScreeningsByCinema(
          screenings.filter((s) => s.date === date)
        );

        if (groups.length === 0) {
          return (
            <div
              key={date}
              className="py-20 md:py-28 flex flex-col items-center text-center gap-3 border-b border-white/10"
            >
              <p className="text-sm md:text-base text-white/55">
                Brak seansów w&nbsp;tym dniu.
              </p>
              <button
                type="button"
                onClick={() => setSelectedDate(null)}
                className="text-[11px] uppercase tracking-[0.25em] text-white/50 hover:text-white border-b border-white/20 hover:border-white pb-0.5 transition-colors"
              >
                Pokaż wszystkie daty
              </button>
            </div>
          );
        }

        return (
          <div key={date}>
            {!selectedDate && (
              <p className="pt-7 pb-1 text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/40 tabular-nums">
                {formatDateLabel(date)}
              </p>
            )}
            <ul className="divide-y divide-white/10 border-b border-white/10">
              {groups.map((cinemaScreenings) => (
                <li key={cinemaScreenings[0].cinema.id}>
                  <CinemaRow screenings={cinemaScreenings} />
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default MovieScreenings;
