"use client";

import React, { useMemo, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Popover as PopoverPrimitive } from "radix-ui";
import { IGenre } from "@/interfaces/IMovies";
import { useMultiGenreParam } from "@/hooks/use-multi-genre-param";
import { cn } from "@/lib/utils";

interface GenreFieldProps {
  genres: IGenre[];
  className?: string;
}

const GenreField: React.FC<GenreFieldProps> = ({ genres, className }) => {
  const { selectedGenreIds, options, toggleGenre, clearGenres, isSelected } =
    useMultiGenreParam(genres);
  const [open, setOpen] = useState(false);

  const hasSelection = selectedGenreIds.length > 0;

  const triggerLabel = useMemo(() => {
    if (selectedGenreIds.length === 0) return "Wszystkie gatunki";
    const first = options.find((o) => o.value === selectedGenreIds[0])?.label;
    if (!first) return "Wszystkie gatunki";
    if (selectedGenreIds.length === 1) return first;
    return `${first} +${selectedGenreIds.length - 1}`;
  }, [selectedGenreIds, options]);

  if (options.length === 0) return null;

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex items-center gap-2.5 h-9 px-3.5 border text-[11px] uppercase tracking-wider transition-colors whitespace-nowrap",
            hasSelection
              ? "border-white text-white"
              : "border-white/25 text-white/80 hover:border-white/60 hover:text-white",
            "data-[state=open]:border-white data-[state=open]:text-white",
            className
          )}
        >
          <span className="truncate max-w-[180px]">{triggerLabel}</span>
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
          className="z-50 w-[280px] bg-black border border-white/15 text-white data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-150"
        >
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">
              Gatunki
            </span>
            {hasSelection && (
              <button
                type="button"
                onClick={clearGenres}
                className="text-[10px] uppercase tracking-[0.2em] text-white/50 hover:text-white border-b border-transparent hover:border-white/40 pb-0.5 transition-colors"
              >
                Wyczyść
              </button>
            )}
          </div>

          <div
            data-lenis-prevent
            className="max-h-72 overflow-y-auto overscroll-contain [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.25)_transparent] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/20"
          >
            {options.map((opt) => {
              const active = isSelected(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggleGenre(opt.value)}
                  aria-pressed={active}
                  className={cn(
                    "flex w-full items-center justify-between gap-2 text-left px-4 py-2 text-[11px] uppercase tracking-wider transition-colors",
                    active
                      ? "text-white bg-white/[0.06]"
                      : "text-white/65 hover:text-white hover:bg-white/[0.03]"
                  )}
                >
                  <span className="truncate">{opt.label}</span>
                  {active && (
                    <Check className="size-3.5 shrink-0" aria-hidden="true" />
                  )}
                </button>
              );
            })}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
};

export default GenreField;
