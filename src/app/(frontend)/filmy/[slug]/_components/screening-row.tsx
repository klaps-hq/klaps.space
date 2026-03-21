import React from "react";
import Link from "next/link";
import { IScreening } from "@/interfaces/IScreenings";

const formatScreeningDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit" });
};

interface ScreeningRowProps {
  screening: IScreening;
}

const ScreeningRow: React.FC<ScreeningRowProps> = ({ screening }) => {
  const badges = [
    screening.isDubbing && "Dubbing",
    screening.isSubtitled && "Napisy",
  ].filter(Boolean) as string[];

  return (
    <div className="grid grid-cols-[60px_50px_1fr] md:grid-cols-[70px_60px_1fr] items-center gap-x-4 md:gap-x-6 py-4 md:py-5 border-b border-white/[0.06]">
      <span className="text-blood-red font-semibold text-sm tabular-nums whitespace-nowrap">
        {formatScreeningDate(screening.date)}
      </span>
      <span className="text-white/70 text-sm tabular-nums">
        {screening.time}
      </span>
      <div className="flex items-center justify-between gap-3 min-w-0">
        <div className="flex flex-col min-w-0">
          <Link
            href={`/miasta/${screening.cinema.city.slug}`}
            className="text-white font-bold text-sm uppercase truncate hover:text-blood-red transition-colors"
          >
            {screening.cinema.city.name}
          </Link>
          <span className="text-neutral-500 text-xs uppercase tracking-wider truncate">
            {screening.cinema.name}
          </span>
        </div>
        {badges.length > 0 && (
          <div className="flex gap-1.5 shrink-0">
            {badges.map((badge) => (
              <span
                key={badge}
                className="text-[10px] uppercase tracking-wider text-neutral-400 border border-white/10 px-2 py-0.5"
              >
                {badge}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScreeningRow;
