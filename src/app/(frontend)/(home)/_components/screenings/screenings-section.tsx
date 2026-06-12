"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { IScreeningGroup } from "@/interfaces/IScreenings";
import { IGenre } from "@/interfaces/IMovies";
import {
  ScreeningsTransitionProvider,
  useScreeningsTransition,
} from "@/contexts/screenings-transition-context";
import { cn } from "@/lib/utils";
import FilterBar from "./filter-bar";
import ScreeningsGrid from "./screenings-grid";
import ScreeningsGridSkeleton from "./grid-skeleton";
import SectionHeader from "./section-header";

interface ScreeningsSectionProps {
  screenings: IScreeningGroup[];
  genres: IGenre[];
  seeAllHref: string;
  hasMore: boolean;
  selectedGenreIds: number[];
  dateFrom: string | null;
  dateTo: string | null;
  search: string | null;
  // First load: no data yet, show the grid skeleton instead of the
  // (misleading) empty state.
  isLoading: boolean;
  // Refetch with stale data on screen: dim the grid like URL transitions do.
  isUpdating: boolean;
}

const ScreeningsSectionInner: React.FC<ScreeningsSectionProps> = ({
  screenings,
  genres,
  seeAllHref,
  hasMore,
  selectedGenreIds,
  dateFrom,
  dateTo,
  search,
  isLoading,
  isUpdating,
}) => {
  const { isPending } = useScreeningsTransition();

  return (
    <section id="seanse" className="relative bg-black text-white">
      <SectionHeader />

      <div>
        <div className="px-6 md:px-12 lg:px-16 py-4 md:py-5">
          <FilterBar genres={genres} />
        </div>
        <div className="h-px w-full bg-white/10" aria-hidden="true" />
      </div>

      <div
        className={cn(
          "px-6 md:px-12 lg:px-16 py-12 md:py-20 transition-opacity duration-200",
          (isPending || isUpdating) && !isLoading && "opacity-50 pointer-events-none"
        )}
      >
        {isLoading ? (
          <ScreeningsGridSkeleton />
        ) : (
          <ScreeningsGrid
            screenings={screenings}
            genres={genres}
            selectedGenreIds={selectedGenreIds}
            dateFrom={dateFrom}
            dateTo={dateTo}
            search={search}
          />
        )}

        {!isLoading && hasMore && screenings.length > 0 && (
          <div className="mt-16 md:mt-24 flex justify-center">
            <Link
              href={seeAllHref}
              className="group inline-flex items-center gap-4 text-xs md:text-sm uppercase tracking-[0.28em] text-white border border-white/25 hover:border-white hover:bg-white/[0.04] px-8 md:px-10 py-4 md:py-5 transition-colors"
            >
              Zobacz wszystkie seanse
              <ArrowRight
                aria-hidden="true"
                className="size-4 shrink-0 transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

const ScreeningsSection: React.FC<ScreeningsSectionProps> = (props) => (
  <ScreeningsTransitionProvider>
    <ScreeningsSectionInner {...props} />
  </ScreeningsTransitionProvider>
);

export default ScreeningsSection;
