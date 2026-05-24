"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Popover as PopoverPrimitive } from "radix-ui";
import type { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { useDateRangeParam } from "@/hooks/use-date-range-param";
import { cn, formatDatePL, getDateString } from "@/lib/utils";

interface DateFieldProps {
  className?: string;
}

const parseDate = (v: string | null | undefined): Date | undefined => {
  if (!v) return undefined;
  const d = new Date(`${v}T00:00:00`);
  return Number.isNaN(d.getTime()) ? undefined : d;
};

const DateField: React.FC<DateFieldProps> = ({ className }) => {
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

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DateRange | undefined>(undefined);

  const hasSelection = !!selectedDay || isRange;

  const triggerLabel = (() => {
    if (isRange && dateFrom && dateTo) {
      return `${formatDatePL(dateFrom)} – ${formatDatePL(dateTo)}`;
    }
    if (selectedDay) {
      const opt = dayOptions.find((o) => o.value === selectedDay);
      return opt?.label ?? "Wszystkie daty";
    }
    return "Wszystkie daty";
  })();

  const openPanel = (next: boolean) => {
    if (next) {
      setDraft({
        from: parseDate(dateFrom) ?? new Date(),
        to: parseDate(dateTo) ?? parseDate(dateFrom) ?? new Date(),
      });
    }
    setOpen(next);
  };

  const onApplyRange = () => {
    if (!draft?.from || !draft?.to) return;
    handleRangeChange(getDateString(draft.from), getDateString(draft.to));
    setOpen(false);
  };

  const onPickDay = (value: string) => {
    handleDayClick(value);
    setOpen(false);
  };

  const onClearAll = () => {
    handleClearDate();
    setDraft(undefined);
    setOpen(false);
  };

  const canApplyRange = !!(draft?.from && draft?.to);

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={openPanel}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex items-center justify-between gap-2.5 h-9 min-w-[180px] px-3.5 border text-[11px] uppercase tracking-wider transition-colors whitespace-nowrap",
            hasSelection
              ? "border-white text-white"
              : "border-white/25 text-white/80 hover:border-white/60 hover:text-white",
            "data-[state=open]:border-white data-[state=open]:text-white",
            className
          )}
        >
          <span className="truncate max-w-[160px]">{triggerLabel}</span>
          <ChevronDown
            className="size-3 shrink-0 transition-transform data-[state=open]:rotate-180"
            aria-hidden="true"
          />
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="end"
          sideOffset={1}
          className="z-50 w-[320px] bg-black border border-white/15 text-white data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-150"
        >
          <div className="grid grid-cols-5 gap-1 p-3 border-b border-white/10">
            {dayOptions.map((opt) => {
              const active = !isRange && selectedDay === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onPickDay(opt.value)}
                  className={cn(
                    "text-center px-1 py-2 text-[10px] uppercase tracking-wide transition-colors whitespace-nowrap",
                    active
                      ? "text-white bg-white/[0.08]"
                      : "text-white/65 hover:text-white hover:bg-white/[0.03]"
                  )}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          <Calendar
            mode="range"
            selected={draft}
            onSelect={setDraft}
            numberOfMonths={1}
            defaultMonth={draft?.from ?? new Date()}
          />

          <div className="flex items-center gap-2 px-4 pb-4 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={onClearAll}
              className="flex-1 h-8 text-[10px] uppercase tracking-[0.2em] border border-white/20 text-white/70 hover:text-white hover:border-white/50 transition-colors"
            >
              Wyczyść
            </button>
            <button
              type="button"
              disabled={!canApplyRange}
              onClick={onApplyRange}
              className="flex-1 h-8 text-[10px] uppercase tracking-[0.2em] bg-white text-black hover:bg-white/90 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
            >
              Zastosuj
            </button>
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
};

export default DateField;
