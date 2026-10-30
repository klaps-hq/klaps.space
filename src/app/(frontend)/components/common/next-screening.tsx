"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import AddToCalendarButton from "@/components/common/add-to-calendar-button";
import { usePreferredCity } from "@/contexts/city-context";
import { useNow } from "@/hooks/use-now";
import { dropPastScreenings } from "@/lib/screening-filters";
import { cn, formatDateLabel } from "@/lib/utils";
import { wallTimeToInstant } from "@/lib/warsaw-time";

export interface NextScreeningItem {
  id: number;
  /** API wall time ("…18:30:00Z" means 18:30 in Warsaw). */
  dateTime: string;
  date: string;
  time: string;
  cityId: number;
  /** Main line: the movie on a cinema page, the cinema on a movie page. */
  primary: string;
  /** null renders plain text (a noindex page, e.g. a chain venue). */
  primaryHref: string | null;
  secondary?: string | null;
  calendar: {
    title: string;
    location: string;
    url: string;
    durationMinutes: number | null;
    fileSlug: string;
  };
}

interface NextScreeningProps {
  /** Upcoming screenings sorted by start time; only the first few are needed. */
  items: NextScreeningItem[];
  /** Prefer a screening in the visitor's stored city when there is one. */
  preferCity?: boolean;
  className?: string;
}

// The page is cached (ISR), so the server pick can be in the past by the
// time it is read; the client re-picks once the clock is known. The server
// render shows the first item, which matches the first client render.
const NextScreening: React.FC<NextScreeningProps> = ({
  items,
  preferCity = false,
  className,
}) => {
  const now = useNow();
  const { cityId, isHydrated } = usePreferredCity();

  const next = useMemo(() => {
    const upcoming = now === null ? items : dropPastScreenings(items, now);
    if (preferCity && isHydrated && cityId !== null) {
      const local = upcoming.find((item) => item.cityId === cityId);
      if (local) return local;
    }
    return upcoming[0] ?? null;
  }, [items, now, preferCity, isHydrated, cityId]);

  if (!next) return null;

  const dayLabel = formatDateLabel(next.date);
  const calendarOptions = [
    {
      label: `${next.time} · ${dayLabel}`,
      // Calendar exports need a real instant, not the API wall time.
      start: wallTimeToInstant(next.dateTime).toISOString(),
      uid: `screening-${next.id}@klaps.space`,
      fileName: `${next.calendar.fileSlug}-${next.date}-${next.time.replace(":", "")}.ics`,
      description: `Szczegóły: ${next.calendar.url}`,
    },
  ];

  return (
    <div
      className={cn(
        "flex items-center gap-x-5 gap-y-3 border-y border-white/10 py-4",
        className
      )}
    >
      <div className="flex flex-col gap-1.5 min-w-0">
        <span className="text-[10px] uppercase tracking-[0.25em] text-white/50">
          Najbliższy seans
        </span>
        <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-xl md:text-2xl font-semibold tabular-nums -tracking-[0.01em] text-white">
            {dayLabel} · {next.time}
          </span>
          <span className="min-w-0 text-[11px] md:text-xs uppercase tracking-[0.2em] text-white/60">
            {next.primaryHref ? (
              <Link
                href={next.primaryHref}
                className="text-white/80 hover:text-white underline-offset-4 hover:underline transition-colors"
              >
                {next.primary}
              </Link>
            ) : (
              <span className="text-white/80">{next.primary}</span>
            )}
            {next.secondary ? ` · ${next.secondary}` : ""}
          </span>
        </span>
      </div>
      <AddToCalendarButton
        className="ml-auto shrink-0"
        title={next.calendar.title}
        durationMinutes={next.calendar.durationMinutes}
        location={next.calendar.location}
        url={next.calendar.url}
        options={calendarOptions}
      />
    </div>
  );
};

export default NextScreening;
