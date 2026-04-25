"use client";

import React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { usePreferredCity } from "@/contexts/city-context";
import { useScreeningsTransition } from "@/contexts/screenings-transition-context";

interface EmptyStateProps {
  onClearAll: () => void;
  hasAnyFilter: boolean;
}

const EmptyStateView: React.FC<EmptyStateProps> = ({
  onClearAll,
  hasAnyFilter,
}) => (
  <div className="flex flex-col items-center justify-center py-32 md:py-44 text-center">
    <p className="text-sm md:text-base text-white/55">
      {hasAnyFilter
        ? "Brak wyników dla wybranych filtrów."
        : "Brak aktywnych seansów."}
    </p>

    {hasAnyFilter && (
      <button
        type="button"
        onClick={onClearAll}
        className="mt-6 text-[11px] uppercase tracking-[0.25em] text-white/50 hover:text-white border-b border-white/20 hover:border-white pb-0.5 transition-colors"
      >
        Wyczyść filtry
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
  const { cityId, setCityId } = usePreferredCity();

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

  const hasAnyFilter =
    cityId !== null || !!dateLabel || !!genresLabel || !!searchLabel;

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
    <EmptyStateView onClearAll={handleClearAll} hasAnyFilter={hasAnyFilter} />
  );
};

export default ScreeningsEmptyState;
