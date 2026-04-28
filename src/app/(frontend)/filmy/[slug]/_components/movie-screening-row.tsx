import React from "react";
import Link from "next/link";
import { IScreening } from "@/interfaces/IScreenings";
import { formatDatePL } from "@/lib/utils";

interface MovieScreeningRowProps {
  screenings: IScreening[];
  showDate?: boolean;
  index: number;
  total: number;
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
        className="inline-flex items-center justify-center h-8 px-3 text-[11px] font-semibold uppercase tracking-[0.2em] border border-white/25 text-white/85 hover:bg-white hover:text-black hover:border-white transition-colors"
      >
        {screening.time}
      </a>
    );
  }
  return (
    <span className="inline-flex items-center justify-center h-8 px-3 text-[11px] font-semibold uppercase tracking-[0.2em] border border-white/15 bg-white/5 text-white/60 cursor-default">
      {screening.time}
    </span>
  );
};

const MovieScreeningRow: React.FC<MovieScreeningRowProps> = ({
  screenings,
  showDate = false,
  index,
  total,
}) => {
  const firstScreening = screenings[0];
  if (!firstScreening) return null;

  const sortedScreenings = [...screenings].sort((a, b) =>
    a.dateTime.localeCompare(b.dateTime)
  );

  const groupedByDate = showDate
    ? sortedScreenings.reduce<Record<string, IScreening[]>>((acc, s) => {
        (acc[s.date] ??= []).push(s);
        return acc;
      }, {})
    : null;

  const dateKeys = groupedByDate ? Object.keys(groupedByDate).sort() : [];

  return (
    <div className="grid grid-cols-[auto_1fr] md:grid-cols-[auto_minmax(160px,200px)_1fr] items-baseline gap-x-6 md:gap-x-10 px-6 md:px-12 lg:px-16 py-6 md:py-8">
      <span className="font-mono tabular-nums text-[10px] md:text-[11px] tracking-wider text-white/30 self-start mt-2">
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>

      <span className="hidden md:block text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-white/45 self-start mt-2">
        {firstScreening.cinema.city.name}
      </span>

      <div className="flex flex-col gap-4 min-w-0">
        <div className="flex flex-col gap-1.5">
          <Link
            href={`/kina/${firstScreening.cinema.slug}`}
            className="group inline-flex items-center gap-2 text-xl md:text-2xl lg:text-3xl font-bold uppercase -tracking-[0.02em] leading-tight text-white hover:text-white/80 transition-colors w-fit"
          >
            <span className="truncate">{firstScreening.cinema.name}</span>
            <span
              aria-hidden="true"
              className="text-base md:text-lg text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all duration-300"
            >
              →
            </span>
          </Link>
          <span className="md:hidden text-[10px] uppercase tracking-[0.3em] text-white/45">
            {firstScreening.cinema.city.name}
          </span>
          {firstScreening.cinema.street && (
            <span className="text-[11px] md:text-xs uppercase tracking-[0.2em] text-white/40">
              {firstScreening.cinema.street}
            </span>
          )}
        </div>

        {showDate && groupedByDate ? (
          <div className="flex flex-col gap-3">
            {dateKeys.map((date) => (
              <div key={date} className="flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/45 tabular-nums">
                  {formatDatePL(date)}
                </span>
                <div className="flex flex-wrap gap-2">
                  {groupedByDate[date]!.map((screening) => (
                    <ScreeningTime key={screening.id} screening={screening} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {sortedScreenings.map((screening) => (
              <ScreeningTime key={screening.id} screening={screening} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieScreeningRow;
