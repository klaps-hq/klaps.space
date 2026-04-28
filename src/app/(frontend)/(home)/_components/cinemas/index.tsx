import React from "react";
import Link from "next/link";
import { getCinemas } from "@/lib/cinemas";

const PER_ROW = 25;
const MAX_NAME_LENGTH = 18;

interface MarqueeCinema {
  id: string | number;
  slug: string;
  name: string;
  city: string;
}

interface MarqueeRowProps {
  items: MarqueeCinema[];
  durationSec: number;
  reverse?: boolean;
}

const MarqueeRow: React.FC<MarqueeRowProps> = ({
  items,
  durationSec,
  reverse,
}) => {
  const animation = `${reverse ? "marquee-reverse" : "marquee"} ${durationSec}s linear infinite`;
  return (
    <div
      className="flex items-baseline gap-12 md:gap-20 whitespace-nowrap will-change-transform group-hover:[animation-play-state:paused] motion-reduce:animate-none"
      style={{ width: "max-content", animation }}
    >
      {[...items, ...items].map((cinema, i) => (
        <Link
          key={`${cinema.id}-${i}`}
          href={`/kina/${cinema.slug}`}
          className="group/item inline-flex items-baseline gap-3 md:gap-5"
        >
          <span className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold uppercase -tracking-[0.02em] text-white/45 group-hover/item:text-white transition-colors duration-300">
            {cinema.name}
          </span>
          <span className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-white/45">
            {cinema.city}
          </span>
        </Link>
      ))}
    </div>
  );
};

const Cinemas = async () => {
  const { data: groups } = await getCinemas({ limit: 1000 });

  const interleaved: MarqueeCinema[] = [];
  let added = true;
  let cursor = 0;
  while (added && interleaved.length < PER_ROW * 2) {
    added = false;
    for (const group of groups) {
      const cinema = group.cinemas[cursor];
      if (!cinema) continue;
      added = true;
      if (cinema.name.length > MAX_NAME_LENGTH) continue;
      interleaved.push({
        id: cinema.id,
        slug: cinema.slug,
        name: cinema.name,
        city: group.city.name,
      });
      if (interleaved.length >= PER_ROW * 2) break;
    }
    cursor += 1;
  }

  if (interleaved.length === 0) return null;

  const rowOne = interleaved.slice(0, PER_ROW);
  const rowTwo = interleaved.slice(PER_ROW, PER_ROW * 2);
  const totalCount = groups.reduce((acc, g) => acc + g.cinemas.length, 0);

  return (
    <section className="relative bg-black text-white border-t border-white/10">
      <div className="px-6 md:px-12 lg:px-16 pt-24 md:pt-32 pb-12 md:pb-16">
        <div className="mb-6 flex items-center gap-4 text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/45">
          <span className="h-px w-12 bg-white/25" aria-hidden="true" />
          <span>Lista kin · {totalCount}</span>
        </div>
        <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-[1.2] -tracking-[0.01em]">
          <span className="block text-white font-medium">
            Kina studyjne w&nbsp;całej Polsce.
          </span>
          <span className="block text-white/45">
            Miejsca, w&nbsp;których kino jest czymś więcej niż rozrywką.
          </span>
        </h2>
      </div>

      <div className="relative overflow-hidden group">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 md:w-40 bg-gradient-to-r from-black to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 md:w-40 bg-gradient-to-l from-black to-transparent"
        />
        <div className="flex flex-col gap-4 md:gap-8 py-10 md:py-14">
          <MarqueeRow items={rowOne} durationSec={220} />
          {rowTwo.length > 0 && (
            <MarqueeRow items={rowTwo} durationSec={260} reverse />
          )}
        </div>
      </div>

      <div className="px-6 md:px-12 lg:px-16 py-12 md:py-16 flex justify-end">
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
