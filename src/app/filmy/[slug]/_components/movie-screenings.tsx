"use client";

import React, { useState } from "react";
import { IScreening } from "@/interfaces/IScreenings";
import EmptyState from "@/components/common/empty-state";
import MovieScreeningRow from "./movie-screening-row";
import { groupScreeningsByCinema } from "@/lib/screenings";
import DateTabs from "@/components/common/date-tabs";
import HeaderCitySelect from "@/components/layout/header/header-city-select";

type MovieScreeningsProps = {
  screenings: IScreening[];
};

const MovieScreenings: React.FC<MovieScreeningsProps> = ({ screenings }) => {
  const availableDates = [...new Set(screenings.map((s) => s.date))].sort();

  const [selectedDate, setSelectedDate] = useState<string | null>(
    () => availableDates[0] ?? null
  );

  const filteredScreenings = selectedDate
    ? screenings.filter((s) => s.date === selectedDate)
    : screenings;

  const groupedScreenings = groupScreeningsByCinema(filteredScreenings);

  if (screenings.length === 0) {
    return (
      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h2 className="text-white text-2xl md:text-3xl font-bold uppercase tracking-wide">
            Seanse
          </h2>
          <HeaderCitySelect size="md" />
        </div>
        <EmptyState
          headline="Brak nadchodzących seansów"
          description="Aktualnie nie ma zaplanowanych seansów dla tego filmu."
        />
      </section>
    );
  }

  const handleDateChange = (date: string | null) => {
    setSelectedDate(date);
  };

  return (
    <section className="flex flex-col gap-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-white text-2xl md:text-3xl font-bold uppercase tracking-wide">
          Seanse
        </h2>
        <HeaderCitySelect size="md" />
      </div>

      <DateTabs
        dates={availableDates}
        selectedDate={selectedDate ?? availableDates[0] ?? ""}
        onDateChange={handleDateChange}
        label="Data seansów"
      />

      {groupedScreenings.length === 0 && (
        <EmptyState
          headline="Brak seansów w tym dniu"
          description="Wybierz inną datę, aby zobaczyć dostępne seanse."
        />
      )}

      {groupedScreenings.length > 0 && (
        <div className="flex flex-col border-t border-white/10">
          {groupedScreenings.map((cinemaScreenings) => (
            <MovieScreeningRow
              key={cinemaScreenings[0].cinema.id}
              screenings={cinemaScreenings}
              showDate={!selectedDate}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default MovieScreenings;
