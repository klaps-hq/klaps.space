import React from "react";
import { cn } from "@/lib/utils";
import SectionLoader from "@/components/ui/section-loader";

interface FilterPendingGridProps {
  // Whether the section narrows by the visitor's stored city/voivodeship.
  // URL filters affect every listing; a stored location only these.
  followsLocation: boolean;
  // A filtered result is being fetched client-side while the default grid
  // is still the one mounted.
  loading?: boolean;
  // The server-rendered default grid.
  children: React.ReactNode;
}

// Wraps a cached default grid that a filter may be about to replace. Before
// hydration the head script (lib/filter-pending.ts) hides it through CSS;
// after hydration `loading` does the same. Either way the grid keeps its
// height and a loader stands in, instead of the wrong list flashing by.
// Hook-free, so the default grid stays server-rendered.
const FilterPendingGrid: React.FC<FilterPendingGridProps> = ({
  followsLocation,
  loading = false,
  children,
}) => {
  const scope = followsLocation ? "location" : "";

  return (
    <div className="relative">
      <div data-filter-default={scope} className={cn(loading && "invisible")}>
        {children}
      </div>
      <div
        data-filter-loader={scope}
        aria-hidden="true"
        className={cn(
          "absolute inset-x-0 top-0 justify-center",
          loading ? "flex" : "hidden"
        )}
      >
        {/* The label only renders client-side while a filter loads: in the
            server HTML it sat next to the real cards on ~30 pages, where
            text extractors and AI crawlers read "Ładowanie seansów" as
            content (audit #7). Before hydration the spinner alone shows. */}
        <SectionLoader
          className="min-h-0 py-16 md:py-24"
          label={loading ? "Ładowanie seansów" : undefined}
        />
      </div>
    </div>
  );
};

export default FilterPendingGrid;
