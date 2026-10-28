"use client";

import React from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { SavedCinema, useMyCinemas } from "@/hooks/use-my-cinemas";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

interface SaveCinemaButtonProps {
  cinema: SavedCinema;
  className?: string;
}

// Star toggle for "Moje kina". Renders the unsaved state on the server and
// during hydration, so cached HTML never disagrees with the first render.
const SaveCinemaButton: React.FC<SaveCinemaButtonProps> = ({
  cinema,
  className,
}) => {
  const { isSaved, toggle, isHydrated } = useMyCinemas();
  const saved = isHydrated && isSaved(cinema.id);

  return (
    <span
      className={cn(
        "flex flex-wrap items-baseline gap-x-3 gap-y-1 whitespace-nowrap",
        className
      )}
    >
      <button
        type="button"
        onClick={() => {
          trackEvent("save_cinema", {
            cinema_slug: cinema.slug,
            saved: !saved,
          });
          toggle(cinema);
        }}
        aria-pressed={saved}
        // py/-my widen the ~12px label to a usable tap target.
        className={cn(
          "group inline-flex items-center gap-1.5 py-2.5 -my-2.5 uppercase transition-colors",
          saved ? "text-white" : "text-white/70 hover:text-white"
        )}
      >
        <Star
          aria-hidden="true"
          className={cn(
            "size-3.5 shrink-0 transition-transform group-active:scale-90",
            saved && "fill-white"
          )}
        />
        {saved ? "W moich kinach" : "Dodaj do moich kin"}
      </button>
      {saved && (
        <>
          <span aria-hidden="true">·</span>
          <Link
            href="/seanse?moje=1"
            className="text-white/70 hover:text-white transition-colors border-b border-transparent hover:border-white/40 pb-0.5"
          >
            Repertuar moich kin
          </Link>
        </>
      )}
    </span>
  );
};

export default SaveCinemaButton;
