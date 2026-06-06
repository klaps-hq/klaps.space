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
    // Single navigation clears every param (including "city") - the context
    // only updates its state and storage, otherwise its own router.replace
    // races with ours and restores the stale "city" param.
    if (cityId !== null) setCityId(null, { navigate: false });
    updateParams((p) => {
      p.delete("city");
      p.delete("dateFrom");
      p.delete("dateTo");
      p.delete("genres");
      p.delete("search");
    });
  };

  if (hasAnyFilter) {
    return (
      <EmptyState
        title="Nic tu nie gra."
        description={
          <>
            Żaden seans nie pasuje do wybranych filtrów. Zmień miasto, zakres
            dat, gatunek albo frazę. Możesz też zacząć od nowa.
          </>
        }
        cta={{ label: "Wyczyść filtry", onClick: handleClearAll }}
      />
    );
  }

  return (
    <EmptyState
      title="Chwilowa przerwa."
      description={
        <>
          Repertuar jest w&nbsp;trakcie aktualizacji. Kina studyjne dodają
          seanse na bieżąco, zajrzyj ponownie wkrótce.
        </>
      }
      cta={{ label: "Przeglądaj kina", href: "/kina" }}
    />
  );
};

export default ScreeningsEmptyState;
