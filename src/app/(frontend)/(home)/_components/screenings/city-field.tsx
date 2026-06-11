"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from "lucide-react";
import { Popover as PopoverPrimitive } from "radix-ui";
import { ICityOption } from "@/interfaces/ICities";
import { usePreferredCity } from "@/contexts/city-context";
import { formatVoivodeship } from "@/lib/voivodeships";
import { cn } from "@/lib/utils";

interface CityFieldProps {
  className?: string;
}

interface VoivodeshipGroup {
  name: string;
  cities: ICityOption[];
}

const OPTION_BUTTON_CLASS =
  "flex w-full items-center justify-between gap-2 text-left px-4 py-2 text-[11px] uppercase tracking-wider transition-colors";

const optionClass = (selected: boolean) =>
  cn(
    OPTION_BUTTON_CLASS,
    selected
      ? "text-white bg-white/[0.06]"
      : "text-white/65 hover:text-white hover:bg-white/[0.03]"
  );

// "Wszystkie miasta" / "Wszystkie miasta w: ..." stand out from the
// regular rows: always white, slightly taller, separated by a divider.
const allOptionClass = (selected: boolean) =>
  cn(
    OPTION_BUTTON_CLASS,
    "py-3 font-medium text-white border-b border-white/10",
    selected ? "bg-white/[0.06]" : "hover:bg-white/[0.03]"
  );

const CityField: React.FC<CityFieldProps> = ({ className }) => {
  const {
    cityId,
    voivodeship,
    locationLabel,
    isHydrated,
    setCityId,
    setVoivodeship,
    cities,
  } = usePreferredCity();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  // Two-level drill-down: voivodeships first, then that voivodeship's
  // cities. Reset to the top level every time the popover closes.
  const [activeVoivodeship, setActiveVoivodeship] = useState<string | null>(
    null
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Switching levels (or searching) replaces the list content - start
  // the new list from the top instead of inheriting the old scroll.
  useEffect(() => {
    listRef.current?.scrollTo({ top: 0 });
  }, [activeVoivodeship, query]);

  const displayLabel = isHydrated ? locationLabel : "Wszystkie miasta";
  const hasSelection = isHydrated && (cityId !== null || voivodeship !== null);

  const voivodeshipGroups = useMemo<VoivodeshipGroup[]>(() => {
    const map = new Map<string, ICityOption[]>();
    for (const city of cities) {
      // Cities without a voivodeship stay reachable through search
      // and the "Wszystkie miasta" state.
      if (!city.voivodeship) continue;
      const bucket = map.get(city.voivodeship);
      if (bucket) bucket.push(city);
      else map.set(city.voivodeship, [city]);
    }
    return Array.from(map.entries())
      .map(([name, groupCities]) => ({
        name,
        cities: [...groupCities].sort((a, b) =>
          a.name.localeCompare(b.name, "pl")
        ),
      }))
      .sort((a, b) => a.name.localeCompare(b.name, "pl"));
  }, [cities]);

  // Typing searches cities directly, skipping the voivodeship level.
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return cities
      .filter((c) => c.name.toLowerCase().includes(q))
      .sort((a, b) => a.name.localeCompare(b.name, "pl"));
  }, [cities, query]);

  const activeGroup = useMemo(
    () =>
      activeVoivodeship
        ? (voivodeshipGroups.find((g) => g.name === activeVoivodeship) ?? null)
        : null,
    [voivodeshipGroups, activeVoivodeship]
  );

  const resetView = () => {
    setQuery("");
    setActiveVoivodeship(null);
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) resetView();
  };

  const selectCity = (id: number | null) => {
    setCityId(id);
    setOpen(false);
    resetView();
  };

  const selectVoivodeship = (name: string) => {
    setVoivodeship(name);
    setOpen(false);
    resetView();
  };

  const renderCityOption = (city: ICityOption) => (
    <button
      key={city.id}
      type="button"
      onClick={() => selectCity(city.id)}
      className={optionClass(city.id === cityId)}
    >
      <span className="truncate">{city.name}</span>
      {city.id === cityId && (
        <Check className="size-3.5 shrink-0" aria-hidden="true" />
      )}
    </button>
  );

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
          <span className="truncate max-w-[160px]">{displayLabel}</span>
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
              placeholder="Szukaj miasta..."
              aria-label="Szukaj miasta"
              className="w-full h-11 pl-11 pr-9 bg-transparent text-white text-[12px] tracking-wide placeholder:text-white/40 outline-none"
            />
            {query.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                aria-label="WyczyĹ›Ä‡ wyszukiwanie"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          <div
            ref={listRef}
            data-lenis-prevent
            className="max-h-72 overflow-y-auto overscroll-contain [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.25)_transparent] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/20"
          >
            {searchResults !== null ? (
              searchResults.length === 0 ? (
                <div className="px-4 py-6 text-center text-[11px] text-white/40 uppercase tracking-wider">
                  Brak wynikĂłw
                </div>
              ) : (
                searchResults.map(renderCityOption)
              )
            ) : activeGroup !== null ? (
              <>
                <button
                  type="button"
                  onClick={() => setActiveVoivodeship(null)}
                  className="flex w-full items-center gap-2 text-left px-4 py-2.5 text-[10px] uppercase tracking-[0.2em] text-white/45 hover:text-white border-b border-white/10 transition-colors"
                >
                  <ChevronLeft className="size-3.5 shrink-0" aria-hidden="true" />
                  WojewĂłdztwa
                </button>
                <button
                  type="button"
                  onClick={() => selectVoivodeship(activeGroup.name)}
                  className={allOptionClass(voivodeship === activeGroup.name)}
                >
                  {/* Wrap instead of truncating - the longest voivodeship
                      names do not fit the 300px popover on one line. */}
                  <span>
                    Wszystkie miasta w: {formatVoivodeship(activeGroup.name)}
                  </span>
                  {voivodeship === activeGroup.name && (
                    <Check className="size-3.5 shrink-0" aria-hidden="true" />
                  )}
                </button>
                {activeGroup.cities.map(renderCityOption)}
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => selectCity(null)}
                  className={allOptionClass(!hasSelection)}
                >
                  <span className="truncate">Wszystkie miasta</span>
                  {!hasSelection && (
                    <Check className="size-3.5 shrink-0" aria-hidden="true" />
                  )}
                </button>
                {voivodeshipGroups.map((group) => (
                  <button
                    key={group.name}
                    type="button"
                    onClick={() => setActiveVoivodeship(group.name)}
                    className={optionClass(voivodeship === group.name)}
                  >
                    <span className="flex items-baseline gap-2 min-w-0">
                      <span className="truncate">
                        {formatVoivodeship(group.name)}
                      </span>
                      <span className="text-white/35 tabular-nums">
                        {group.cities.length}
                      </span>
                    </span>
                    <ChevronRight
                      className="size-3.5 shrink-0 text-white/35"
                      aria-hidden="true"
                    />
                  </button>
                ))}
              </>
            )}
          </div>

          {hasSelection && (
            <div className="px-4 py-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => selectCity(null)}
                className="w-full h-8 text-[10px] uppercase tracking-[0.2em] border border-white/20 text-white/70 hover:text-white hover:border-white/50 transition-colors"
              >
                WyczyĹ›Ä‡
              </button>
            </div>
          )}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
};

export default CityField;
