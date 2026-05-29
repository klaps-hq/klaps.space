"use client";

import React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { usePreferredCity } from "@/contexts/city-context";
import { useScreeningsTransition } from "@/contexts/screenings-transition-context";
import EmptyState from "@/components/common/empty-state";

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
    <EmptyState
      description={
        hasAnyFilter
          ? "Brak seansów pasujących do wybranych filtrów. Spróbuj zmienić zakres dat, gatunek, miasto lub frazę."
          : "Brak aktualnych seansów. Sprawdź ponownie później."
      }
      cta={
        hasAnyFilter
          ? { label: "Wyczyść filtry", onClick: handleClearAll }
          : undefined
      }
    />
  );
};

export default ScreeningsEmptyState;
