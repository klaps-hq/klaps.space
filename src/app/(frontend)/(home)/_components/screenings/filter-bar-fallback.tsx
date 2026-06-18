import React from "react";

// Static, non-interactive placeholder shown in the static HTML while the
// real FilterBar (which reads useSearchParams) is client-rendered after
// hydration. Matches the FilterBar layout/height to avoid layout shift.
const FilterBarFallback: React.FC = () => (
  <div
    className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6"
    aria-hidden="true"
  >
    <div className="h-9 md:w-72 lg:w-80 border-b border-white/15" />
    <div className="flex flex-col md:flex-row md:flex-wrap md:items-center gap-3 md:ml-auto">
      <div className="h-9 w-full md:w-[180px] border border-white/25" />
      <div className="h-9 w-full md:w-[180px] border border-white/25" />
      <div className="h-9 w-full md:w-[180px] border border-white/25" />
    </div>
  </div>
);

export default FilterBarFallback;
