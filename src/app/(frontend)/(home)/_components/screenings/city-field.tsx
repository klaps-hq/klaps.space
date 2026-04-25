"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { MapPin, ChevronDown, Check, Search, X } from "lucide-react";
import { usePreferredCity } from "@/contexts/city-context";
import { cn } from "@/lib/utils";

interface CityFieldProps {
  className?: string;
}

const CityField: React.FC<CityFieldProps> = ({ className }) => {
  const { cityName, isHydrated, cityId, setCityId, options } =
    usePreferredCity();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const displayLabel = isHydrated ? cityName : "Wszystkie miasta";
  const hasSelection = isHydrated && cityId !== null;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  return (
    <div
      ref={wrapRef}
      data-cursor="compact"
      className={cn("relative shrink-0", className)}
    >
      <div
        className={cn(
          "flex items-stretch h-10 border transition-colors",
          open
            ? "border-white bg-white/5"
            : hasSelection
              ? "border-white/70 bg-white/[0.03] hover:border-white"
              : "border-white/20 hover:border-white/60"
        )}
      >
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex items-center gap-2.5 px-4 text-white"
        >
          <MapPin
            className={cn(
              "size-4 transition-colors shrink-0",
              hasSelection ? "text-white" : "text-white/60"
            )}
            aria-hidden="true"
          />
          <span
            className={cn(
              "uppercase tracking-wider text-[11px] min-w-[120px] max-w-[220px] truncate text-left",
              hasSelection ? "font-semibold text-white" : "font-medium"
            )}
          >
            {displayLabel}
          </span>
          <ChevronDown
            className={cn(
              "size-3.5 text-white/60 transition-transform shrink-0",
              open && "rotate-180"
            )}
            aria-hidden="true"
          />
        </button>
        {hasSelection && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setCityId(null);
            }}
            aria-label="Wyczyść miasto"
            title="Pokaż wszystkie miasta"
            className="flex items-center justify-center w-8 border-l border-white/15 text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="size-3.5" aria-hidden="true" />
          </button>
        )}
      </div>
      {open && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-black border border-white/20 z-30 flex flex-col">
          <div className="relative border-b border-white/10">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-white/55 pointer-events-none"
              aria-hidden="true"
            />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Szukaj miasta..."
              className="w-full h-10 pl-9 pr-3 bg-transparent text-white text-sm tracking-wide placeholder:text-white/65 focus:placeholder:text-white/40 outline-none transition-colors"
            />
          </div>
          <div
            data-lenis-prevent
            className="max-h-72 overflow-y-auto overscroll-contain [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.25)_transparent] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb:hover]:bg-white/40"
          >
            {filtered.length === 0 ? (
              <div className="px-3 py-4 text-center text-[11px] text-white/40 uppercase tracking-wider">
                Brak wyników
              </div>
            ) : (
              filtered.map((opt) => {
                const selected =
                  opt.value === cityId ||
                  (opt.value === null && cityId === null);
                return (
                  <button
                    key={opt.value ?? "all"}
                    type="button"
                    onClick={() => {
                      setCityId(opt.value);
                      setOpen(false);
                      setQuery("");
                    }}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 text-left px-3 py-2 text-[11px] uppercase tracking-wider transition-colors",
                      selected
                        ? "bg-white text-black"
                        : "text-white/75 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <span className="truncate">{opt.label}</span>
                    {selected && (
                      <Check className="size-3.5 shrink-0" aria-hidden="true" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CityField;
