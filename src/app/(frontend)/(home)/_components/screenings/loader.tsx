import React from "react";
import ScreeningsGridSkeleton from "./grid-skeleton";

const ScreeningsLoader: React.FC = () => (
  <section id="seanse" className="relative bg-black text-white">
    <div className="px-6 md:px-12 lg:px-16 pt-24 md:pt-32 pb-10 md:pb-14">
      <div className="space-y-3 md:space-y-4 max-w-[22ch]">
        <div className="h-8 md:h-12 lg:h-16 xl:h-20 w-[55%] bg-white/[0.06] animate-pulse" />
        <div className="h-8 md:h-12 lg:h-16 xl:h-20 w-full bg-white/[0.04] animate-pulse" />
      </div>
      <div className="mt-6 md:mt-7 max-w-[58ch] space-y-2">
        <div className="h-4 md:h-5 w-full bg-white/[0.04] animate-pulse" />
        <div className="h-4 md:h-5 w-3/4 bg-white/[0.04] animate-pulse" />
      </div>
    </div>

    <div>
      <div className="px-6 md:px-12 lg:px-16 py-4 md:py-5">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
          <div className="md:w-72 lg:w-80 h-9 border-b border-white/15" />
          <div className="flex items-center gap-3 md:ml-auto">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-9 min-w-[180px] border border-white/15"
              />
            ))}
          </div>
        </div>
      </div>
      <div className="h-px w-full bg-white/10" aria-hidden="true" />
    </div>

    <div className="px-6 md:px-12 lg:px-16 py-12 md:py-20">
      <ScreeningsGridSkeleton />
    </div>
  </section>
);

export default ScreeningsLoader;
