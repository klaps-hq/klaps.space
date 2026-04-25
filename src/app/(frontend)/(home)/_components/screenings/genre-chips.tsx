"use client";

import React, { useState } from "react";
import { Check, ChevronDown, ChevronUp, X } from "lucide-react";
import { IGenre } from "@/interfaces/IMovies";
import { useMultiGenreParam } from "@/hooks/use-multi-genre-param";
import { cn } from "@/lib/utils";

const VISIBLE_COUNT = 10;

interface GenreChipsProps {
  genres: IGenre[];
  className?: string;
}

const GenreChips: React.FC<GenreChipsProps> = ({ genres, className }) => {
  const { selectedGenreIds, options, toggleGenre, clearGenres, isSelected } =
    useMultiGenreParam(genres);
  const [expanded, setExpanded] = useState(false);

  if (options.length === 0) return null;

  const hasMore = options.length > VISIBLE_COUNT;
  const visible = expanded ? options : options.slice(0, VISIBLE_COUNT);
  const hiddenSelectedCount = expanded
    ? 0
    : selectedGenreIds.filter(
        (id) => !visible.some((o) => o.value === id)
      ).length;

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span className="text-[10px] uppercase tracking-[0.25em] text-white/40 mr-1">
        Gatunki
      </span>
      {visible.map((g) => {
        const active = isSelected(g.value);
        return (
          <button
            key={g.value}
            type="button"
            onClick={() => toggleGenre(g.value)}
            aria-pressed={active}
            className={cn(
              "flex items-center gap-1.5 px-3 h-7 text-[11px] uppercase tracking-wider border transition-colors whitespace-nowrap",
              active
                ? "bg-white text-black border-white"
                : "bg-transparent text-white/70 border-white/15 hover:text-white hover:border-white/50"
            )}
          >
            {active && <Check className="size-3" aria-hidden="true" />}
            {g.label}
          </button>
        );
      })}
      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="flex items-center gap-1 px-2 h-7 text-[10px] uppercase tracking-widest text-white/50 hover:text-white transition-colors"
        >
          {expanded ? (
            <>
              Zwiń <ChevronUp className="size-3" aria-hidden="true" />
            </>
          ) : (
            <>
              +{options.length - VISIBLE_COUNT} więcej
              {hiddenSelectedCount > 0 && (
                <span className="ml-1 text-white/80">
                  ({hiddenSelectedCount} zazn.)
                </span>
              )}
              <ChevronDown className="size-3" aria-hidden="true" />
            </>
          )}
        </button>
      )}
      {selectedGenreIds.length > 0 && (
        <button
          type="button"
          onClick={clearGenres}
          aria-label="Wyczyść gatunki"
          className="flex items-center gap-1 px-2 h-7 text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-colors"
        >
          <X className="size-3" aria-hidden="true" /> Wyczyść
        </button>
      )}
    </div>
  );
};

export default GenreChips;
