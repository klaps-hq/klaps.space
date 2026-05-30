"use client";

import React, { useState } from "react";
import { IScreening } from "@/interfaces/IScreenings";
import CityField from "@/app/(home)/_components/screenings/city-field";
import { groupScreeningsByCinema } from "@/lib/screenings";
import { formatDateLabel, cn } from "@/lib/utils";
import MovieScreeningRow from "./movie-screening-row";

interface MovieScreeningsProps {
  screenings: IScreening[];
}

const MovieScreenings: React.FC<MovieScreeningsProps> = ({ screenings }) => {
  const availableDates = [...new Set(screenings.map((s) => s.date))].sort();
  const [selectedDate, setSelectedDate] = useState<string | null>(
    () => availableDates[0] ?? null
  );

  const filteredScreenings = selectedDate
    ? screenings.filter((s) => s.date === selectedDate)
    : screenings;

  const groupedScreenings = groupScreeningsByCinema(filteredScreenings);
  const totalRows = groupedScreenings.length;

  return (
    <section className="relative bg-black text-white border-t border-white/10">
      <div className="px-6 md:px-12 lg:px-16 pt-24 md:pt-32 pb-12 md:pb-16">
        <div className="mb-8 flex items-center gap-4 text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/50">
          <span className="h-px w-12 bg-white/30" aria-hidden="true" />
          <span>Repertuar</span>
        </div>
        <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold uppercase leading-[0.9] -tracking-[0.03em] text-white">
          Seanse
        </h2>
        <p className="mt-6 max-w-xl text-sm md:text-base text-white/55 leading-relaxed">
          Najbliższe pokazy w&nbsp;kinach studyjnych. Wybierz datę
          i&nbsp;miasto, żeby zawęzić wyniki.
        </p>
      </div>

      {screenings.length === 0 ? (
        <div className="border-t border-white/10 px-6 md:px-12 lg:px-16 py-24 md:py-32 flex flex-col items-center text-center gap-3">
          <p className="text-sm md:text-base text-white/55">
            Brak nadchodzących seansów.
          </p>
          <p className="text-[11px] uppercase tracking-[0.25em] text-white/35">
            Sprawdź ponownie później
          </p>
        </div>
      ) : (
        <>
          <div className="border-y border-white/10 px-6 md:px-12 lg:px-16 py-5 md:py-6 flex flex-wrap items-center gap-x-6 gap-y-4">
            <span className="text-[10px] uppercase tracking-[0.25em] text-white/40 mr-1">
              Data
            </span>
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

          {groupedScreenings.length === 0 ? (
            <div className="px-6 md:px-12 lg:px-16 py-24 md:py-32 flex flex-col items-center text-center gap-3 border-b border-white/10">
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
          ) : (
            <ul>
              {groupedScreenings.map((cinemaScreenings, idx) => (
                <li
                  key={cinemaScreenings[0].cinema.id}
                  className="border-b border-white/10"
                >
                  <MovieScreeningRow
                    screenings={cinemaScreenings}
                    showDate={!selectedDate}
                    index={idx}
                    total={totalRows}
                  />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
};

export default MovieScreenings;
