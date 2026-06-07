"use client";

import React, { useEffect, useRef, useState } from "react";
import { CalendarPlus } from "lucide-react";
import {
  buildGoogleCalendarUrl,
  buildIcsContent,
  CalendarEventInput,
} from "@/lib/calendar";
import { cn } from "@/lib/utils";

// Fallback event length when the movie duration is unknown.
const DEFAULT_DURATION_MINUTES = 120;

// Apple devices get an .ics download (opens Apple Calendar), everything
// else a prefilled Google Calendar link. iPadOS reports "Macintosh".
const isAppleDevice = (): boolean =>
  /iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent);

export interface CalendarEventOption {
  /** Menu label when there is more than one option, e.g. "20:00 · 15.06". */
  label: string;
  /** Event start as an ISO date-time string. */
  start: string;
  uid: string;
  /** Name of the downloaded .ics file. */
  fileName: string;
  description?: string;
}

interface AddToCalendarButtonProps {
  title: string;
  durationMinutes?: number | null;
  location?: string;
  url?: string;
  options: CalendarEventOption[];
  /**
   * "icon" renders an icon-only button, "labeled" a flat icon + label
   * button with a tall touch target.
   */
  variant?: "icon" | "labeled";
  className?: string;
}

const AddToCalendarButton: React.FC<AddToCalendarButtonProps> = ({
  title,
  durationMinutes,
  location,
  url,
  options,
  variant = "icon",
  className,
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Close the menu on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const saveOption = (option: CalendarEventOption) => {
    const startDate = new Date(option.start);
    const event: CalendarEventInput = {
      title,
      start: startDate,
      end: new Date(
        startDate.getTime() +
          (durationMinutes ?? DEFAULT_DURATION_MINUTES) * 60 * 1000
      ),
      location,
      description: option.description,
      url,
      uid: option.uid,
    };

    if (!isAppleDevice()) {
      window.open(
        buildGoogleCalendarUrl(event),
        "_blank",
        "noopener,noreferrer"
      );
      setOpen(false);
      return;
    }

    const blob = new Blob([buildIcsContent(event)], {
      type: "text/calendar;charset=utf-8",
    });
    const blobUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = blobUrl;
    anchor.download = option.fileName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(blobUrl);
    setOpen(false);
  };

  if (options.length === 0) return null;

  const single = options.length === 1;

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() =>
          single ? saveOption(options[0]) : setOpen((value) => !value)
        }
        aria-haspopup={single ? undefined : "menu"}
        aria-expanded={single ? undefined : open}
        aria-label={`Zapisz w kalendarzu: ${title}`}
        title="Zapisz w kalendarzu"
        className={cn(
          variant === "labeled"
            ? "inline-flex items-center gap-2 py-2 text-[10px] uppercase tracking-[0.2em] text-white/70 hover:text-white transition-colors"
            : "p-2 -m-2 text-white/40 hover:text-white transition-colors",
          open && "text-white"
        )}
      >
        <CalendarPlus aria-hidden="true" className="w-4 h-4" />
        {variant === "labeled" && <span>Kalendarz</span>}
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Wybierz seans do zapisania"
          className={cn(
            "absolute top-full z-20 flex flex-col whitespace-nowrap border border-white/20 bg-black",
            variant === "labeled" ? "left-0 mt-1" : "right-0 mt-3"
          )}
        >
          {options.map((option) => (
            <button
              key={option.uid}
              role="menuitem"
              type="button"
              onClick={() => saveOption(option)}
              className="px-4 py-3 text-left text-[10px] uppercase tracking-[0.2em] tabular-nums text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddToCalendarButton;
