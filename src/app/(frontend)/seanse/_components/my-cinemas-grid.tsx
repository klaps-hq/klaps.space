"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { IScreeningGroup } from "@/interfaces/IScreenings";
import { IGenre } from "@/interfaces/IMovies";
import { useMyCinemas } from "@/hooks/use-my-cinemas";
import { filterScreeningGroups } from "@/lib/screening-filters";
import { toCardGroup } from "@/lib/client-screenings";
import EmptyState from "@/components/common/empty-state";
import SectionLoader from "@/components/ui/section-loader";
import ScreeningsGrid from "../../(home)/_components/screenings/screenings-grid";

interface MyCinemasGridProps {
  genres: IGenre[];
  selectedGenreIds: number[];
  dateFrom: string | null;
  dateTo: string | null;
  search: string | null;
}

// Repertoire of the visitor's starred cinemas. The cinema list is known
// only in the browser, so this view is fetched client-side and narrowed
// by the same URL filters as the regular listing.
const MyCinemasGrid: React.FC<MyCinemasGridProps> = ({
  genres,
  selectedGenreIds,
  dateFrom,
  dateTo,
  search,
}) => {
  const { cinemas, isHydrated } = useMyCinemas();
  const [result, setResult] = useState<{
    key: string;
    screenings: IScreeningGroup[];
  } | null>(null);

  const key = cinemas
    .map((c) => c.id)
    .sort((a, b) => a - b)
    .join(",");

  useEffect(() => {
    if (!isHydrated || key === "") return;
    const controller = new AbortController();
    fetch(`/api/my-screenings?cinemas=${key}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<{ screenings: IScreeningGroup[] }>;
      })
      .then((data) => setResult({ key, screenings: data.screenings }))
      .catch((error) => {
        if (controller.signal.aborted) return;
        console.warn("Falling back to empty my-cinemas screenings:", error);
        setResult({ key, screenings: [] });
      });
    return () => controller.abort();
  }, [isHydrated, key]);

  const filtered = useMemo(
    () =>
      result
        ? filterScreeningGroups(result.screenings, {
            genreIds: selectedGenreIds,
            dateFrom,
            dateTo,
            search,
          }).map(toCardGroup)
        : [],
    [result, selectedGenreIds, dateFrom, dateTo, search]
  );

  if (isHydrated && cinemas.length === 0) {
    return (
      <EmptyState
        title="Brak zapisanych kin."
        description="Dodaj kino do swoich na jego stronie, gwiazdką przy adresie. Tutaj zobaczysz repertuar wszystkich zapisanych kin naraz."
        cta={{ href: "/kina", label: "Wybierz kina" }}
      />
    );
  }

  if (!result || result.key !== key) {
    return <SectionLoader className="min-h-[40vh]" />;
  }

  return (
    <div className="flex flex-col gap-10 md:gap-12">
      <p className="flex flex-wrap gap-x-3 gap-y-2 text-[10px] md:text-xs uppercase tracking-[0.22em] text-white/50">
        <span>Twoje kina:</span>
        {cinemas.map((cinema, index) => (
          <span key={cinema.id}>
            <Link
              href={`/kina/${cinema.slug}`}
              className="text-white/75 hover:text-white transition-colors border-b border-transparent hover:border-white/40 pb-0.5"
            >
              {cinema.name}
            </Link>
            {index < cinemas.length - 1 && <span aria-hidden="true">,</span>}
          </span>
        ))}
      </p>
      {result.screenings.length === 0 ? (
        <EmptyState
          description="Twoje kina nie mają teraz zapowiedzianych seansów specjalnych. Repertuar uzupełniamy na bieżąco, zajrzyj ponownie wkrótce."
          cta={{ href: "/seanse", label: "Cały repertuar" }}
        />
      ) : (
        <ScreeningsGrid
          interactive
          screenings={filtered}
          genres={genres}
          selectedGenreIds={selectedGenreIds}
          dateFrom={dateFrom}
          dateTo={dateTo}
          search={search}
        />
      )}
    </div>
  );
};

export default MyCinemasGrid;
