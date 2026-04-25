"use client";

import React, { useEffect, useRef, useState } from "react";
import { CalendarDays, X } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { useDateRangeParam } from "@/hooks/use-date-range-param";
import { cn, formatDatePL, getDateString } from "@/lib/utils";

interface DateStripProps {
  className?: string;
}

const DateStrip: React.FC<DateStripProps> = ({ className }) => {
  const {
    dayOptions,
    selectedDay,
    isRange,
    dateFrom,
    dateTo,
    handleDayClick,
    handleRangeChange,
    handleClearDate,
  } = useDateRangeParam();

  const [rangeOpen, setRangeOpen] = useState(false);
  const parseDate = (v: string | null | undefined): Date | undefined => {
    if (!v) return undefined;
    const d = new Date(`${v}T00:00:00`);
    return Number.isNaN(d.getTime()) ? undefined : d;
  };
  const [draft, setDraft] = useState<DateRange | undefined>({
    from: parseDate(dateFrom) ?? new Date(),
    to: parseDate(dateTo) ?? parseDate(dateFrom) ?? new Date(),
  });
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rangeOpen) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setRangeOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [rangeOpen]);

  const canApply = !!(draft?.from && draft?.to);

  const toggleRangePanel = () => {
    if (!rangeOpen) {
      setDraft({
        from: parseDate(dateFrom) ?? new Date(),
        to: parseDate(dateTo) ?? parseDate(dateFrom) ?? new Date(),
      });
    }
    setRangeOpen((o) => !o);
  };

  const handleApply = () => {
    if (!draft?.from || !draft?.to) return;
    handleRangeChange(getDateString(draft.from), getDateString(draft.to));
    setRangeOpen(false);
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2 overflow-x-auto md:overflow-visible md:flex-wrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className
      )}
    >
      {dayOptions.map((opt) => {
        const active = !isRange && selectedDay === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => handleDayClick(opt.value)}
            className={cn(
              "shrink-0 px-3 h-8 text-[11px] uppercase tracking-wider border transition-colors whitespace-nowrap",
              active
                ? "bg-white text-black border-white"
                : "bg-transparent text-white/80 border-white/20 hover:text-white hover:border-white/60"
            )}
          >
            {opt.label}
          </button>
        );
      })}

      <div ref={panelRef} className="relative shrink-0">
        <button
          type="button"
          onClick={toggleRangePanel}
          className={cn(
            "flex items-center gap-1.5 px-3 h-8 text-[11px] uppercase tracking-wider border transition-colors whitespace-nowrap",
            isRange
              ? "bg-white text-black border-white"
              : "bg-transparent text-white/80 border-white/20 hover:text-white hover:border-white/60"
          )}
          aria-expanded={rangeOpen}
        >
          <CalendarDays className="size-3.5" aria-hidden="true" />
          {isRange && dateFrom && dateTo
            ? `${formatDatePL(dateFrom)} – ${formatDatePL(dateTo)}`
            : "Zakres"}
        </button>

        {rangeOpen && (
          <div
            data-lenis-prevent
            className="absolute top-full left-0 mt-2 bg-black border border-white/20 z-30 flex flex-col"
          >
            <Calendar
              mode="range"
              selected={draft}
              onSelect={setDraft}
              numberOfMonths={1}
              defaultMonth={draft?.from ?? new Date()}
            />
            <div className="px-3 py-2 flex flex-col gap-1 border-t border-white/10">
              <span className="text-[10px] uppercase tracking-[0.25em] text-white/50">
                Zakres dat
              </span>
              <span className="text-[11px] uppercase tracking-[0.2em] text-white/80">
                {draft?.from && draft?.to
                  ? `${formatDatePL(getDateString(draft.from))} – ${formatDatePL(getDateString(draft.to))}`
                  : "Wybierz dwie daty"}
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 pb-3 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setDraft(undefined)}
                className="flex-1 h-8 text-[10px] uppercase tracking-[0.2em] border border-white/20 text-white/70 hover:text-white hover:border-white/50 transition-colors"
              >
                Wyczyść
              </button>
              <button
                type="button"
                disabled={!canApply}
                onClick={handleApply}
                className="flex-1 h-8 text-[10px] uppercase tracking-[0.2em] bg-white text-black hover:bg-white/90 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
              >
                Zastosuj
              </button>
            </div>
          </div>
        )}
      </div>

      {(selectedDay || isRange) && (
        <button
          type="button"
          onClick={handleClearDate}
          aria-label="Wyczyść datę"
          className="shrink-0 flex items-center gap-1 text-[10px] uppercase tracking-widest text-white/40 hover:text-white px-2 h-8 transition-colors"
        >
          <X className="size-3" aria-hidden="true" />
          Wyczyść
        </button>
      )}
    </div>
  );
};

export default DateStrip;
