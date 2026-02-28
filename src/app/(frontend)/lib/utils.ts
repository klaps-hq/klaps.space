import { IGenre } from "@/interfaces/IMovies";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatGenres = (genres: IGenre[], max: number = 2) => {
  return genres
    .slice(0, max)
    .map((genre) => genre.name)
    .join("/");
};

export const formatDuration = (duration: number | null): string => {
  if (!duration) return "";

  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;

  return `${hours}h ${minutes}m`;
};

export const createDateByDaysIncrement = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return getDateString(date);
};

export const formatDatePL = (dateStr: string | null): string => {
  if (!dateStr) return "";

  return new Date(dateStr).toLocaleDateString("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const getTodayDatePL = () => formatDatePL(new Date().toISOString());

export const formatNames = (
  entities: { name: string }[] | null | undefined
): string | null => {
  const result = entities
    ?.map((e) => e.name.trim())
    .filter(Boolean)
    .join(", ");
  return result || null;
};

export const getDateString = (date: Date) =>
  date.toISOString().split("T")[0] ?? "";

export const isToday = (dateStr: string) => {
  const d = new Date(dateStr);
  const today = new Date();
  return getDateString(d) === getDateString(today);
};

export const isTomorrow = (dateStr: string) => {
  const d = new Date(dateStr);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return getDateString(d) === getDateString(tomorrow);
};

export const formatDateLabel = (dateStr: string) => {
  if (isToday(dateStr)) return "Dziś";
  if (isTomorrow(dateStr)) return "Jutro";
  const d = new Date(dateStr);
  const dayNames = ["Nd", "Pn", "Wt", "Śr", "Cz", "Pt", "So"];
  const day = dayNames[d.getDay()];
  const date = d.toLocaleDateString("pl-PL", {
    day: "2-digit",
    month: "2-digit",
  });
  return `${day} ${date}`;
};

export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "…";
};

export const getTitleSizeClasses = (title: string): string => {
  const length = title.length;

  if (length < 15) {
    return "text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-[128px] leading-tight md:leading-[1.15]";
  }

  if (length < 25) {
    return "text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[108px] leading-tight md:leading-[1.15]";
  }

  if (length < 35) {
    return "text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[90px] leading-tight md:leading-[1.2]";
  }

  if (length < 50) {
    return "text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[72px] leading-tight md:leading-[1.25]";
  }

  return "text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-[56px] leading-tight md:leading-[1.3]";
};
