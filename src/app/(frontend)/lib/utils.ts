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

// All visible dates are anchored to Polish time. Without an explicit
// timeZone the output depends on the runtime zone (server renders in UTC,
// the browser in the visitor's zone), which both breaks React hydration
// (error #418) and shows off-by-one dates to visitors west of UTC.
export const WARSAW_TZ = "Europe/Warsaw";

export const formatDatePL = (dateStr: string | null): string => {
  if (!dateStr) return "";

  return new Date(dateStr).toLocaleDateString("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: WARSAW_TZ,
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

// Calendar date in Warsaw time as YYYY-MM-DD (en-CA renders ISO order).
// toISOString would use UTC, which is a day behind Warsaw between
// midnight and 01:00/02:00 local time.
export const getDateString = (date: Date) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: WARSAW_TZ }).format(date);

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
  // Weekday of the Warsaw calendar date: getDateString resolves the
  // instant to a Warsaw date, and parsing a date-only string is UTC, so
  // getUTCDay reads that date's weekday without another zone shift.
  const day = dayNames[new Date(getDateString(d)).getUTCDay()];
  const date = d.toLocaleDateString("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    timeZone: WARSAW_TZ,
  });
  return `${day} ${date}`;
};

export function getYouTubeEmbedUrl(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
  );
  return match?.[1] ? `https://www.youtube.com/embed/${match[1]}` : null;
}
