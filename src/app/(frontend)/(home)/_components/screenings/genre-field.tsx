"use client";

import React, { useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
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
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const hasSelection = selectedGenreIds.length > 0;

  const triggerLabel = useMemo(() => {
    if (selectedGenreIds.length === 0) return "Wszystkie gatunki";
    const first = options.find((o) => o.value === selectedGenreIds[0])?.label;
    if (!first) return "Wszystkie gatunki";
    if (selectedGenreIds.length === 1) return first;
    return `${first} +${selectedGenreIds.length - 1}`;
  }, [selectedGenreIds, options]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setQuery("");
  };

  if (options.length === 0) return null;

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange}>
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
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            // iOS zooms in and scrolls to a focused sub-16px input. Skip
            // autofocus on touch so opening the picker stays in place.
            if (window.matchMedia("(pointer: coarse)").matches) return;
            inputRef.current?.focus();
          }}
          className="z-50 w-[300px] bg-black border border-white/15 text-white data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-150"
        >
          <div className="relative border-b border-white/10">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 size-3.5 text-white/45 pointer-events-none"
              aria-hidden="true"
            />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Szukaj gatunku..."
              aria-label="Szukaj gatunku"
              className="w-full h-11 pl-11 pr-9 bg-transparent text-white text-[12px] tracking-wide placeholder:text-white/50 outline-none"
            />
            {query.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                aria-label="Wyczyść wyszukiwanie"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          <div
            data-lenis-prevent
            className="max-h-72 overflow-y-auto overscroll-contain [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.25)_transparent] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/20"
          >
            {filtered.length === 0 ? (
              <div className="px-4 py-6 text-center text-[11px] text-white/50 uppercase tracking-wider">
                Brak wyników
              </div>
            ) : (
              filtered.map((opt) => {
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
              })
            )}
          </div>

          {hasSelection && (
            <div className="px-4 py-3 border-t border-white/10">
              <button
                type="button"
                onClick={clearGenres}
                className="w-full h-8 text-[10px] uppercase tracking-[0.2em] border border-white/20 text-white/70 hover:text-white hover:border-white/50 transition-colors"
              >
                Wyczyść
              </button>
            </div>
          )}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
};

export default GenreField;
