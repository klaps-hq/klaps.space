import React from "react";
import Link from "next/link";
import { IScreening } from "@/interfaces/IScreenings";
import { Button } from "@/components/ui/button";
import { formatDatePL } from "@/lib/utils";

type MovieScreeningRowProps = {
  screenings: IScreening[];
  showDate?: boolean;
};

const hasTicketUrl = (screening: IScreening): boolean =>
  !!screening.ticketUrl && screening.ticketUrl.trim().length > 0;

const ScreeningTime: React.FC<{ screening: IScreening }> = ({ screening }) => {
  return (
    <span className="inline-flex items-center justify-center h-8 px-3 text-sm font-semibold uppercase tracking-[0.2em] border border-white/20 bg-white/5 text-white/80 cursor-default">
      {screening.time}
    </span>
  );
};

const MovieScreeningRow: React.FC<MovieScreeningRowProps> = ({
  screenings,
  showDate = false,
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
    <div className="flex flex-col gap-4 py-6 border-b border-white/10 last:border-b-0">
      <div className="flex flex-col gap-1 max-w-fit">
        <span className="text-blood-red text-sm uppercase tracking-widest font-semibold">
          {firstScreening.cinema.city.name}
        </span>

        <Link
          href={`/kina/${firstScreening.cinema.slug}`}
          className="text-white text-lg md:text-xl font-bold hover:text-blood-red transition-colors"
        >
          {firstScreening.cinema.name}
        </Link>

        {firstScreening.cinema.street && (
          <span className="text-neutral-400 text-sm">
            {firstScreening.cinema.street}
          </span>
        )}
      </div>

      {showDate && groupedByDate ? (
        <div className="flex flex-col gap-4">
          {dateKeys.map((date) => (
            <div key={date} className="flex flex-col gap-2">
              <span className="text-neutral-400 text-sm tabular-nums">
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
  );
};

export default MovieScreeningRow;
