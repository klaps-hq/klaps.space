import React from "react";
import { getCinemas } from "@/lib/cinemas";

const formatPlural = (
  n: number,
  forms: [singular: string, few: string, many: string]
): string => {
  if (n === 1) return forms[0];
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1];
  return forms[2];
};

const About = async () => {
  const { data: groups } = await getCinemas({ limit: 1000 });
  const cinemaCount = groups.reduce((acc, g) => acc + g.cinemas.length, 0);
  const cityCount = groups.length;

  return (
    <section className="relative bg-black text-white border-y border-white/10">
      <div className="px-6 md:px-12 lg:px-16 py-24 md:py-40">
        <div className="flex flex-col gap-8 md:gap-10">
          <div className="flex items-center gap-4 text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/45">
            <span className="h-px w-12 bg-white/25" aria-hidden="true" />
            <span>O projekcie · Klaps</span>
          </div>

          <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-[1.2] -tracking-[0.01em]">
            <span className="block text-white font-medium">
              Klaps to ogólnopolski repertuar seansów specjalnych, klasyki
              i&nbsp;filmów spoza głównego obiegu.
            </span>
            <span className="block mt-2 text-white/45">
              Zbieramy program kin studyjnych oraz wybrane seanse
              z&nbsp;większych sieci kinowych — wszędzie tam, gdzie stare filmy
              wracają na duży ekran.
            </span>
          </h2>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/40">
            <span>
              <span className="text-white tabular-nums">{cinemaCount}</span>{" "}
              {formatPlural(cinemaCount, ["kino", "kina", "kin"])}
            </span>
            <span aria-hidden="true">·</span>
            <span>
              <span className="text-white tabular-nums">{cityCount}</span>{" "}
              {formatPlural(cityCount, ["miasto", "miasta", "miast"])}
            </span>
            <span aria-hidden="true">·</span>
            <span>Ogólnopolski</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
