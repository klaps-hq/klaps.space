"use client";

import React, { Suspense, useState } from "react";
import { IGenre } from "@/interfaces/IMovies";
import { IRepertoire } from "@/lib/client-screenings";
import {
  ScreeningsTransitionProvider,
  useScreeningsTransition,
} from "@/contexts/screenings-transition-context";
import { cn } from "@/lib/utils";
import FilterBarFallback from "../../(home)/_components/screenings/filter-bar-fallback";
import FilterPendingGrid from "./filter-pending-grid";
import RepertoireFilterIsland from "./repertoire-filter-island";
import { ScreeningCardGrid } from "./repertoire-grid";

export interface RepertoireSectionClientProps {
  repertoire: IRepertoire;
  genres: IGenre[];
  // Server-rendered heading, kept out of the filter island so it stays in
  // the static HTML together with the grid.
  heading?: React.ReactNode;
  // Shown when a filter matches nothing. Rendered client-side only, so it
  // may use hooks; the server grid below carries its own hook-free variant.
  emptyState: React.ReactNode;
  hideCity?: boolean;
  hideGenres?: boolean;
  usePreferredLocation?: boolean;
  className?: string;
  // Server-rendered default grid, passed as children so it lives in the
  // static HTML; the client only swaps it out when a filter is active.
  children: React.ReactNode;
}

const RepertoireSectionInner: React.FC<RepertoireSectionClientProps> = ({
  repertoire,
  genres,
  heading,
  emptyState,
  hideCity,
  hideGenres,
  usePreferredLocation,
  className,
  children,
}) => {
  const { isPending } = useScreeningsTransition();
  // null = default view (render the server-rendered children grid); an array
  // = active filter result, replacing the default.
  const [override, setOverride] = useState<IRepertoire | null>(null);

  return (
    <section className={className}>
      {heading}

      <div className="mb-10 md:mb-12">
        {/* The filter controls read useSearchParams, so they live in their
            own Suspense island; the grid below is untouched by that and
            stays server-rendered in the static HTML. */}
        <Suspense fallback={<FilterBarFallback />}>
          <RepertoireFilterIsland
            repertoire={repertoire}
            genres={genres}
            hideCity={hideCity}
            hideGenres={hideGenres}
            usePreferredLocation={usePreferredLocation}
            onResult={setOverride}
          />
        </Suspense>
        <div
          className="mt-8 md:mt-12 -mx-6 md:-mx-12 lg:-mx-16 h-px bg-white/10"
          aria-hidden="true"
        />
      </div>

      <div
        className={cn(
          "transition-opacity duration-200",
          isPending && "opacity-50 pointer-events-none"
        )}
      >
        {override === null ? (
          <FilterPendingGrid followsLocation={Boolean(usePreferredLocation)}>
            {children}
          </FilterPendingGrid>
        ) : (
          <ScreeningCardGrid repertoire={override} emptyState={emptyState} />
        )}
      </div>
    </section>
  );
};

const RepertoireSection: React.FC<RepertoireSectionClientProps> = (props) => (
  <ScreeningsTransitionProvider>
    <RepertoireSectionInner {...props} />
  </ScreeningsTransitionProvider>
);

export default RepertoireSection;
