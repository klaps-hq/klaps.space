"use client";

import React from "react";
import { IScreeningGroup } from "@/interfaces/IScreenings";
import { IGenre } from "@/interfaces/IMovies";
import { formatDateLabel, formatDatePL } from "@/lib/utils";
import EmptyState from "@/components/common/empty-state";
import ScreeningCard from "./screening-card";
import ScreeningsEmptyState from "./empty-state";

interface ScreeningsGridProps {
  screenings: IScreeningGroup[];
  genres: IGenre[];
  selectedGenreIds: number[];
  dateFrom: string | null;
  dateTo: string | null;
  search: string | null;
  // The default grid is server-rendered; its empty state must stay
  // hook-free (a hook-based "clear filters" CTA would call useSearchParams
  // outside a Suspense boundary and break the static prerender). Only the
  // client-side filtered grid sets this to get the interactive empty state.
  interactive?: boolean;
}

const buildDateLabel = (
  from: string | null,
  to: string | null
): string | null => {
  if (!from && !to) return null;
  if (from && to && from === to) return formatDateLabel(from);
  if (from && to) return `${formatDatePL(from)} – ${formatDatePL(to)}`;
  if (from) return `od ${formatDatePL(from)}`;
  if (to) return `do ${formatDatePL(to)}`;
  return null;
};

const buildGenresLabel = (
  selectedIds: number[],
  genres: IGenre[]
): string | null => {
  if (selectedIds.length === 0) return null;
  const names = selectedIds
    .map((id) => genres.find((g) => g.id === id)?.name)
    .filter((n): n is string => Boolean(n));
  if (names.length === 0) return null;
  return names.join(", ");
};

const ScreeningsGrid: React.FC<ScreeningsGridProps> = ({
  screenings,
  genres,
  selectedGenreIds,
  dateFrom,
  dateTo,
  search,
  interactive = false,
}) => {
  if (screenings.length === 0) {
    // Server-rendered default view: a static, hook-free empty state so the
    // page can be prerendered. (At build time the upstream data is empty, so
    // this branch is what renders into the static HTML.)
    if (!interactive) {
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
    }
    return (
      <ScreeningsEmptyState
        genresLabel={buildGenresLabel(selectedGenreIds, genres)}
        dateLabel={buildDateLabel(dateFrom, dateTo)}
        searchLabel={search && search.trim().length > 0 ? search.trim() : null}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-10 gap-x-4 md:gap-x-6 gap-y-10 md:gap-y-12">
      {screenings.map((group) => (
        <ScreeningCard key={group.movie.id} group={group} />
      ))}
    </div>
  );
};

export default ScreeningsGrid;
