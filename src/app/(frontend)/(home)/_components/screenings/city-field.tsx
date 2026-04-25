"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { MapPin, ChevronDown, Check } from "lucide-react";
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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  return (
    <div ref={wrapRef} className={cn("relative shrink-0", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={cn(
          "flex items-center gap-2 h-10 px-3 border text-white transition-colors",
          open
            ? "border-white bg-white/5"
            : "border-white/20 hover:border-white/60"
        )}
      >
        <MapPin className="size-4 text-white/60" aria-hidden="true" />
        <span className="uppercase tracking-wider text-[11px] font-medium max-w-[160px] truncate">
          {displayLabel}
        </span>
        <ChevronDown
          className={cn(
            "size-3.5 text-white/60 transition-transform",
            open && "rotate-180"
          )}
          aria-hidden="true"
        />
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-black border border-white/20 z-30 flex flex-col">
          <div className="relative border-b border-white/10">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Szukaj miasta..."
              className="w-full h-9 px-3 bg-transparent text-white text-xs tracking-wide placeholder:text-white/40 focus:placeholder:text-white/20 outline-none"
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
