"use client";

import React, { useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
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
  const inputRef = useRef<HTMLInputElement>(null);

  const displayLabel = isHydrated ? cityName : "Wszystkie miasta";
  const hasSelection = isHydrated && cityId !== null;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild>
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
          <span className="truncate max-w-[160px]">{displayLabel}</span>
          <ChevronDown
            className="size-3 shrink-0 transition-transform data-[state=open]:rotate-180"
            aria-hidden="true"
          />
        </button>
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-200" />
        <DialogPrimitive.Content
          className="fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-black border-l border-white/15 flex flex-col data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right duration-300 ease-out"
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            inputRef.current?.focus();
          }}
        >
          <div className="flex items-center justify-between px-6 pt-8 pb-6">
            <DialogPrimitive.Title className="text-[10px] uppercase tracking-[0.3em] text-white/45">
              Wybierz miasto
            </DialogPrimitive.Title>
            <DialogPrimitive.Close className="text-[11px] uppercase tracking-wider text-white/60 hover:text-white border-b border-transparent hover:border-white/40 pb-1 transition-colors">
              Zamknij
            </DialogPrimitive.Close>
          </div>

          <div className="relative border-y border-white/10">
            <Search
              className="absolute left-6 top-1/2 -translate-y-1/2 size-3.5 text-white/45 pointer-events-none"
              aria-hidden="true"
            />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Szukaj miasta..."
              className="w-full h-14 pl-14 pr-6 bg-transparent text-white text-sm tracking-wide placeholder:text-white/40 outline-none"
            />
          </div>

          <div
            data-lenis-prevent
            className="flex-1 overflow-y-auto overscroll-contain [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.25)_transparent] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb:hover]:bg-white/40"
          >
            {filtered.length === 0 ? (
              <div className="px-6 py-8 text-center text-[11px] text-white/40 uppercase tracking-wider">
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
                      "flex w-full items-center justify-between gap-2 text-left px-6 py-3 text-[12px] uppercase tracking-wider transition-colors border-b border-white/[0.04]",
                      selected
                        ? "text-white bg-white/[0.06]"
                        : "text-white/65 hover:text-white hover:bg-white/[0.03]"
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
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

export default CityField;
