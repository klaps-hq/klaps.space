import React from "react";
import Link from "next/link";
import { getCinemas } from "@/lib/cinemas";

const VISIBLE_LIMIT = 5;

const Cinemas = async () => {
  const { data: groups } = await getCinemas({ limit: 1000 });

  const allCinemas = groups.flatMap((group) =>
    group.cinemas.map((cinema) => ({
      id: cinema.id,
      slug: cinema.slug,
      name: cinema.name,
      city: group.city,
    }))
  );

  if (allCinemas.length === 0) return null;

  const visibleCinemas = allCinemas.slice(0, VISIBLE_LIMIT);
  const remainingCount = allCinemas.length - VISIBLE_LIMIT;

  return (
    <section className="relative bg-black text-white">
      <div className="px-6 md:px-12 lg:px-16 pt-24 md:pt-32 pb-12 md:pb-16">
        <div className="mb-8 flex items-center gap-4 text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/50">
          <span className="h-px w-12 bg-white/30" aria-hidden="true" />
          <span>Lista kin</span>
        </div>
        <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[120px] font-bold uppercase leading-[0.9] -tracking-[0.03em] text-white">
          Kina studyjne
          <br />w Polsce
        </h2>
        <p className="mt-6 max-w-xl text-sm md:text-base text-white/55 leading-relaxed">
          Miejsca, w których kino jest czymś więcej niż rozrywką.
        </p>
      </div>

      <ul className="border-t border-white/10">
        {visibleCinemas.map((cinema, index) => (
          <li key={cinema.id} className="border-b border-white/10">
            <Link
              href={`/kina/${cinema.slug}`}
              className="group grid grid-cols-[auto_1fr_auto] md:grid-cols-[auto_minmax(160px,200px)_1fr_auto] items-baseline gap-x-6 md:gap-x-10 px-6 md:px-12 lg:px-16 py-5 md:py-6 transition-colors hover:bg-white/[0.02]"
            >
              <span className="font-mono tabular-nums text-[10px] md:text-[11px] tracking-wider text-white/30 group-hover:text-white/60 transition-colors">
                {String(index + 1).padStart(2, "0")} / {String(VISIBLE_LIMIT).padStart(2, "0")}
              </span>

              <span className="hidden md:block text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-white/45 group-hover:text-white transition-colors">
                {cinema.city.name}
              </span>

              <div className="flex flex-col gap-1 min-w-0">
                <span className="text-xl md:text-2xl lg:text-3xl font-bold uppercase -tracking-[0.02em] leading-tight text-white truncate">
                  {cinema.name}
                </span>
                <span className="md:hidden text-[10px] uppercase tracking-[0.3em] text-white/45">
                  {cinema.city.name}
                </span>
              </div>

              <span
                aria-hidden="true"
                className="text-lg md:text-xl text-white/25 group-hover:text-white group-hover:translate-x-1.5 transition-all duration-300"
              >
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="px-6 md:px-12 lg:px-16 py-12 md:py-16 flex justify-between items-center gap-6 border-b border-white/10">
        <span className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-white/35">
          {remainingCount > 0 ? `+${remainingCount} kolejnych` : " "}
        </span>
        <Link
          href="/kina"
          className="group inline-flex items-center gap-3 text-sm md:text-base uppercase tracking-[0.25em] text-white border-b border-white/30 hover:border-white pb-1 transition-colors"
        >
          Pokaż wszystkie kina
          <span
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      </div>
    </section>
  );
};

export default Cinemas;
