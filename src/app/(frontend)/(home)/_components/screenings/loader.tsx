import React from "react";

const ScreeningsLoader: React.FC = () => (
  <section id="seanse" className="relative bg-black text-white">
    <div className="px-6 md:px-12 lg:px-16 pt-24 md:pt-32 pb-10 md:pb-14">
      <div className="mb-8 flex items-center gap-4 text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/50">
        <span className="h-px w-12 bg-white/30" aria-hidden="true" />
        <span>Repertuar</span>
      </div>
      <div className="h-16 md:h-28 lg:h-32 w-56 md:w-80 bg-white/5 animate-pulse" />
    </div>

    <div className="border-y border-white/10">
      <div className="px-6 md:px-12 lg:px-16 py-4 md:py-5 flex flex-col gap-3">
        <div className="h-10 w-full md:max-w-sm bg-white/5 animate-pulse" />
        <div className="flex gap-2 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-8 w-16 shrink-0 bg-white/5 animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>

    <div className="px-6 md:px-12 lg:px-16 py-12 md:py-20">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 md:gap-x-8 gap-y-12 md:gap-y-16">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-4">
            <div className="aspect-[2/3] w-full bg-white/5 animate-pulse" />
            <div className="h-4 w-3/4 bg-white/5 animate-pulse" />
            <div className="h-3 w-1/2 bg-white/5 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ScreeningsLoader;
