"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, type DayPickerProps } from "react-day-picker";
import { pl } from "date-fns/locale";

import { cn } from "@/lib/utils";

type CalendarProps = DayPickerProps;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      locale={pl}
      showOutsideDays={showOutsideDays}
      weekStartsOn={1}
      className={cn("p-4 text-white", className)}
      classNames={{
        root: "relative w-fit",
        months: "flex flex-col sm:flex-row gap-4",
        month: "flex flex-col gap-3",
        month_caption:
          "h-8 flex items-center justify-center uppercase tracking-[0.25em] text-[11px] text-white/90",
        caption_label: "",
        nav: "absolute top-0 inset-x-0 h-8 flex items-center justify-between pointer-events-none",
        button_previous:
          "pointer-events-auto size-8 inline-flex items-center justify-center text-white/50 hover:text-white transition-colors disabled:opacity-30",
        button_next:
          "pointer-events-auto size-8 inline-flex items-center justify-center text-white/50 hover:text-white transition-colors disabled:opacity-30",
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday:
          "w-9 h-8 flex items-center justify-center font-normal text-[9px] uppercase tracking-[0.2em] text-white/30",
        week: "flex w-full",
        day: "w-9 h-9 p-0 text-center focus-within:relative focus-within:z-20",
        day_button:
          "inline-flex w-full h-full items-center justify-center text-xs text-white/70 hover:text-white transition-colors disabled:opacity-30 disabled:pointer-events-none",
        range_start:
          "bg-white [&>button]:text-black [&>button]:hover:text-black [&>button]:font-semibold",
        range_end:
          "bg-white [&>button]:text-black [&>button]:hover:text-black [&>button]:font-semibold",
        range_middle:
          "bg-white/15 [&>button]:text-white/90 [&>button]:hover:text-white",
        today:
          "[&>button]:after:content-[''] [&>button]:relative [&>button]:after:absolute [&>button]:after:bottom-1 [&>button]:after:left-1/2 [&>button]:after:-translate-x-1/2 [&>button]:after:h-0.5 [&>button]:after:w-1.5 [&>button]:after:bg-white/70",
        outside: "[&>button]:text-white/15",
        disabled: "[&>button]:text-white/15 [&>button]:pointer-events-none",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, ...rest }) =>
          orientation === "left" ? (
            <ChevronLeft className="size-4" {...rest} />
          ) : (
            <ChevronRight className="size-4" {...rest} />
          ),
      }}
      {...props}
    />
  );
}

export { Calendar };
