"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { IGenre } from "@/interfaces/IMovies";
import {
  ScreeningsTransitionProvider,
  useScreeningsTransition,
} from "@/contexts/screenings-transition-context";
import { cn } from "@/lib/utils";
import SectionHeader from "./section-header";
import ScreeningsGrid from "./screenings-grid";
import FilterBarFallback from "./filter-bar-fallback";
import ScreeningsFilterController, {
  type FilteredResult,
} from "./filter-controller";

interface HomeScreeningsProps {
  genres: IGenre[];
  // Metadata for the server-rendered default (unfiltered) grid below.
  hasMore: boolean;
  hasDefaultResults: boolean;
  seeAllHref: string;
  // Server-rendered default grid. Rendered by the server page and passed
  // here as children so it lives in the static HTML (crawlable without JS);
  // the client only swaps it out when a filter / preferred city is active.
  children: React.ReactNode;
}

const SeeAllLink: React.FC<{ href: string }> = ({ href }) => (
  <div className="mt-16 md:mt-24 flex justify-center">
    <Link
      href={href}
      className="group inline-flex items-center gap-4 text-xs md:text-sm uppercase tracking-[0.28em] text-white border border-white/25 hover:border-white hover:bg-white/[0.04] px-8 md:px-10 py-4 md:py-5 transition-colors"
    >
      Zobacz wszystkie seanse
      <ArrowRight
        aria-hidden="true"
        className="size-4 shrink-0 transition-transform group-hover:translate-x-1"
      />
    </Link>
  </div>
);

const HomeScreeningsInner: React.FC<HomeScreeningsProps> = ({
  genres,
  hasMore,
  hasDefaultResults,
  seeAllHref,
  children,
}) => {
  const { isPending } = useScreeningsTransition();
  // null = default view (render the server-rendered children grid); a value
  // = active filter result, fetched client-side, replacing the default.
  const [override, setOverride] = useState<FilteredResult | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const showingDefault = override === null;
  const showSeeAll = showingDefault
    ? hasMore && hasDefaultResults
    : override.hasMore && override.screenings.length > 0;
  const activeSeeAllHref = showingDefault ? seeAllHref : override.seeAllHref;

  return (
    <section id="seanse" className="relative bg-black text-white">
      <SectionHeader />

      <div>
        <div className="px-6 md:px-12 lg:px-16 py-4 md:py-5">
          {/* The interactive filter controls read useSearchParams, so they
              live in their own Suspense island; the grid below is untouched
              by that and stays server-rendered in the static HTML. */}
          <Suspense fallback={<FilterBarFallback />}>
            <ScreeningsFilterController
              genres={genres}
              onResult={setOverride}
              onUpdating={setIsUpdating}
            />
          </Suspense>
        </div>
        <div className="h-px w-full bg-white/10" aria-hidden="true" />
      </div>

      <div
        className={cn(
          "px-6 md:px-12 lg:px-16 py-12 md:py-20 transition-opacity duration-200",
          (isPending || isUpdating) && "opacity-50 pointer-events-none"
        )}
      >
        {showingDefault ? (
          children
        ) : (
          <ScreeningsGrid
            screenings={override.screenings}
            genres={genres}
            selectedGenreIds={override.selectedGenreIds}
            dateFrom={override.dateFrom}
            dateTo={override.dateTo}
            search={override.search}
            interactive
          />
        )}

        {showSeeAll && <SeeAllLink href={activeSeeAllHref} />}
      </div>
    </section>
  );
};

const HomeScreenings: React.FC<HomeScreeningsProps> = (props) => (
  <ScreeningsTransitionProvider>
    <HomeScreeningsInner {...props} />
  </ScreeningsTransitionProvider>
);

export default HomeScreenings;
