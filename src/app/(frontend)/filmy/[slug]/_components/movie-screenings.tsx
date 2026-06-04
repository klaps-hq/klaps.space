"use client";

import React, { useState } from "react";
import { IScreening } from "@/interfaces/IScreenings";
import CityField from "@/app/(home)/_components/screenings/city-field";
import { groupScreeningsByCinema } from "@/lib/screenings";
import { formatDateLabel, cn } from "@/lib/utils";
import MovieScreeningRow from "./movie-screening-row";
import MovieSectionHeading from "./movie-section-heading";

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
      <MovieSectionHeading
        eyebrow="Repertuar"
        title="Seanse"
        description="Najbliższe pokazy w kinach studyjnych. Wybierz datę i miasto, żeby zawęzić wyniki."
      />

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
