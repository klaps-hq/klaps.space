"use client";

import React from "react";
import { X } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { usePreferredCity } from "@/contexts/city-context";
import { useScreeningsTransition } from "@/contexts/screenings-transition-context";

interface ActiveFilter {
  label: string;
  onClear: () => void;
}

interface EmptyStateProps {
  activeFilters: ActiveFilter[];
  onClearAll: () => void;
  hasAnyFilter: boolean;
}

const EmptyStateView: React.FC<EmptyStateProps> = ({
  activeFilters,
  onClearAll,
  hasAnyFilter,
}) => (
  <div className="flex flex-col items-center justify-center py-28 md:py-40 text-center">
    <div className="flex items-center gap-4">
      <span className="h-px w-10 bg-white/25" aria-hidden="true" />
      <span className="text-[10px] uppercase tracking-[0.35em] text-white/40">
        Brak wyników
      </span>
      <span className="h-px w-10 bg-white/25" aria-hidden="true" />
    </div>

    <h3 className="mt-6 text-3xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight -tracking-[0.02em] text-white leading-[0.95]">
      Nic nie
      <br />
      znaleziono
    </h3>

    <p className="mt-6 text-sm md:text-base text-white/50 max-w-md leading-relaxed">
      {hasAnyFilter
        ? "Zdejmij część filtrów — niektóre miasta lub daty mają ograniczony repertuar."
        : "Brak aktywnych seansów. Sprawdź ponownie później."}
    </p>

    {activeFilters.length > 0 && (
      <div className="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 max-w-xl">
        {activeFilters.map((f) => (
          <button
            key={f.label}
            type="button"
            onClick={f.onClear}
            className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-white/60 hover:text-white transition-colors"
          >
            <span className="flex items-center justify-center size-5 border border-white/20 group-hover:border-white/60 transition-colors">
              <X className="size-2.5" aria-hidden="true" />
            </span>
            {f.label}
          </button>
        ))}
      </div>
    )}

    {hasAnyFilter && (
      <button
        type="button"
        onClick={onClearAll}
        className="mt-10 group inline-flex items-center gap-3 text-[11px] md:text-xs uppercase tracking-[0.3em] text-white hover:text-white transition-colors"
      >
        <span className="h-px w-8 bg-white/40 group-hover:w-12 group-hover:bg-white transition-all" />
        Wyczyść wszystkie filtry
      </button>
    )}
  </div>
);

interface ScreeningsEmptyStateProps {
  genresLabel: string | null;
  dateLabel: string | null;
  searchLabel: string | null;
}

const ScreeningsEmptyState: React.FC<ScreeningsEmptyStateProps> = ({
  genresLabel,
  dateLabel,
  searchLabel,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { startTransition } = useScreeningsTransition();
  const { cityId, cityName, setCityId } = usePreferredCity();

  const updateParams = (mutator: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    mutator(params);
    params.delete("page");
    const qs = params.toString();
    const url = qs ? `${pathname}?${qs}` : pathname;
    startTransition(() => {
      router.replace(url, { scroll: false });
    });
  };

  const activeFilters: ActiveFilter[] = [];

  if (cityId !== null) {
    activeFilters.push({
      label: `Miasto: ${cityName}`,
      onClear: () => setCityId(null),
    });
  }
  if (dateLabel) {
    activeFilters.push({
      label: `Data: ${dateLabel}`,
      onClear: () =>
        updateParams((p) => {
          p.delete("dateFrom");
          p.delete("dateTo");
        }),
    });
  }
  if (genresLabel) {
    activeFilters.push({
      label: `Gatunki: ${genresLabel}`,
      onClear: () => updateParams((p) => p.delete("genres")),
    });
  }
  if (searchLabel) {
    activeFilters.push({
      label: `Szukaj: "${searchLabel}"`,
      onClear: () => updateParams((p) => p.delete("search")),
    });
  }

  const handleClearAll = () => {
    if (cityId !== null) setCityId(null);
    updateParams((p) => {
      p.delete("dateFrom");
      p.delete("dateTo");
      p.delete("genres");
      p.delete("search");
    });
  };

  return (
    <EmptyStateView
      activeFilters={activeFilters}
      onClearAll={handleClearAll}
      hasAnyFilter={activeFilters.length > 0}
    />
  );
};

export default ScreeningsEmptyState;
