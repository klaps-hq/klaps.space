import React from "react";

// Placeholder mirroring the ScreeningsGrid layout. Rendered by the section
// Suspense fallback and while the client fetches /api/screenings.
const ScreeningsGridSkeleton: React.FC = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-10 gap-x-4 md:gap-x-6 gap-y-10 md:gap-y-12">
    {Array.from({ length: 16 }).map((_, i) => (
      <div key={i} className="flex flex-col gap-3">
        <div className="aspect-[2/3] w-full bg-white/[0.04] animate-pulse" />
        <div className="flex flex-col gap-1.5">
          <div className="h-3.5 w-3/4 bg-white/[0.06] animate-pulse" />
          <div className="h-2.5 w-1/2 bg-white/[0.04] animate-pulse" />
        </div>
        <div className="mt-1.5 flex flex-col gap-1.5 border-t border-white/10 pt-2.5">
          <div className="h-2.5 w-full bg-white/[0.04] animate-pulse" />
          <div className="h-2.5 w-5/6 bg-white/[0.04] animate-pulse" />
        </div>
      </div>
    ))}
  </div>
);

export default ScreeningsGridSkeleton;
