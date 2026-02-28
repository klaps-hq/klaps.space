"use client";

import { useMemo } from "react";
import { IScreeningGroup } from "@/interfaces/IScreenings";

interface UseScreeningDatesReturn {
  dates: string[];
  activeDate: string;
}

const generateUpcomingDates = (daysCount: number): string[] => {
  const dates: string[] = [];
  const today = new Date();

  for (let i = 0; i < daysCount; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date.toISOString().split("T")[0]);
  }

  return dates;
};

export const useScreeningDates = (
  screenings: IScreeningGroup[]
): UseScreeningDatesReturn => {
  const dates = useMemo(() => {
    const screeningDates = screenings.flatMap((s) =>
      s.screenings.map((screening) => screening.date)
    );

    const upcomingDates = generateUpcomingDates(7);
    const allDates = [...screeningDates, ...upcomingDates];

    return [...new Set(allDates)].sort();
  }, [screenings]);

  const activeDate = dates[0] ?? "";

  return {
    dates,
    activeDate,
  };
};
