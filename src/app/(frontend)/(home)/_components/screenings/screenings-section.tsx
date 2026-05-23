"use client";

import React from "react";
import Link from "next/link";
import { IScreeningGroup } from "@/interfaces/IScreenings";
import { IGenre } from "@/interfaces/IMovies";
import {
  ScreeningsTransitionProvider,
  useScreeningsTransition,
} from "@/contexts/screenings-transition-context";
import { cn } from "@/lib/utils";
import FilterBar from "./filter-bar";
import ScreeningsGrid from "./screenings-grid";
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
}) => {
  const { isPending } = useScreeningsTransition();

  return (
    <section id="seanse" className="relative bg-black text-white">
      <SectionHeader />

      <div className="sticky top-0 z-20 bg-black/85 backdrop-blur-md">
        <div className="px-6 md:px-12 lg:px-16 py-4 md:py-5">
          <FilterBar genres={genres} />
        </div>
        <div className="h-px w-full bg-white/[0.06]" aria-hidden="true" />
      </div>

      <div
        className={cn(
          "px-6 md:px-12 lg:px-16 py-12 md:py-20 transition-opacity duration-200",
          isPending && "opacity-50 pointer-events-none"
        )}
      >
        <ScreeningsGrid
          screenings={screenings}
          genres={genres}
          selectedGenreIds={selectedGenreIds}
          dateFrom={dateFrom}
          dateTo={dateTo}
          search={search}
        />

        {hasMore && screenings.length > 0 && (
          <div className="mt-16 md:mt-24 flex justify-center">
            <Link
              href={seeAllHref}
              className="group inline-flex items-center gap-4 text-xs md:text-sm uppercase tracking-[0.28em] text-white border border-white/25 hover:border-white hover:bg-white/[0.04] px-8 md:px-10 py-4 md:py-5 transition-colors"
            >
              Zobacz wszystkie seanse
              <span
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-1"
              >
                →
              </span>
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
