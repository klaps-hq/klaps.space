import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDuration = (duration: number | null): string => {
  if (!duration) return "";

  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;

  return `${hours}h ${minutes}m`;
};

export const formatDatePL = (dateStr: string | null): string => {
  if (!dateStr) return "";

  return new Date(dateStr).toLocaleDateString("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

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

const isToday = (dateStr: string) => {
  const d = new Date(dateStr);
  const today = new Date();
  return getDateString(d) === getDateString(today);
};

const isTomorrow = (dateStr: string) => {
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

export function getYouTubeEmbedUrl(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
  );
  return match?.[1] ? `https://www.youtube.com/embed/${match[1]}` : null;
}
