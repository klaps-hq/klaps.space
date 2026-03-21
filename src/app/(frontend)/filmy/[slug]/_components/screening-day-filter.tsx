import React from "react";
import { cn } from "@/lib/utils";
import { formatDateLabel } from "@/lib/utils";

interface ScreeningDayFilterProps {
  dates: string[];
  selectedDate: string | null;
  onSelect: (date: string | null) => void;
}

const ScreeningDayFilter: React.FC<ScreeningDayFilterProps> = ({
  dates,
  selectedDate,
  onSelect,
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(null)}
        className={cn(
          "h-8 px-3 text-xs font-semibold uppercase tracking-[0.12em] border transition-colors cursor-pointer",
          selectedDate === null
            ? "bg-blood-red/15 text-blood-red border-blood-red/50"
            : "bg-white/5 text-white/60 border-white/10 hover:text-white hover:border-white/20"
        )}
      >
        Wszystkie
      </button>

      {dates.map((date) => (
        <button
          key={date}
          onClick={() => onSelect(date)}
          className={cn(
            "h-8 px-3 text-xs font-semibold uppercase tracking-[0.12em] border transition-colors cursor-pointer",
            selectedDate === date
              ? "bg-blood-red/15 text-blood-red border-blood-red/50"
              : "bg-white/5 text-white/60 border-white/10 hover:text-white hover:border-white/20"
          )}
        >
          {formatDateLabel(date)}
        </button>
      ))}
    </div>
  );
};

export default ScreeningDayFilter;
