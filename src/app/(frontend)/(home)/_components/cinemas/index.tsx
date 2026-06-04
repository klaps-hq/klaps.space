import React from "react";
import Link from "next/link";
import { getCinemas } from "@/lib/cinemas";

const TOP_CITIES_LIMIT = 8;
const CINEMAS_PER_CITY = 6;

const Cinemas = async () => {
  const { data: groups } = await getCinemas({ limit: 1000 });

  const topCities = [...groups]
    .filter((g) => g.cinemas.length > 0)
    .sort((a, b) => b.cinemas.length - a.cinemas.length)
    .slice(0, TOP_CITIES_LIMIT);

  if (topCities.length === 0) return null;

  return (
    <section className="relative bg-black text-white border-t border-white/10">
      <div className="px-6 md:px-12 lg:px-16 pt-24 md:pt-32 pb-10 md:pb-14">
        <h2 className="text-3xl md:text-5xl lg:text-6xl leading-[1.05] -tracking-[0.02em] max-w-[26ch]">
          <span className="block text-white font-medium">
            Kina studyjne w&nbsp;Polsce.
          </span>
          <span className="block text-white/40">
            Niezależne ekrany z&nbsp;autorskim programem.
          </span>
        </h2>
        <p className="mt-4 md:mt-5 max-w-[64ch] text-base md:text-lg text-white/55 leading-relaxed">
          Niezależne miejsca, w&nbsp;których kino traktuje się jak medium,
          nie atrakcję. Klasyka i&nbsp;współczesne kino autorskie,
          retrospektywy, pokazy specjalne i&nbsp;tematyczne cykle. Sprawdź
          repertuary w&nbsp;miastach z&nbsp;całej Polski, otwórz interaktywną
          mapę albo przejdź do pełnej listy kin.
        </p>
      </div>

      <div className="px-6 md:px-12 lg:px-16 pb-12 md:pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 lg:gap-x-12 gap-y-12 md:gap-y-16">
          {topCities.map((group) => (
            <div key={group.city.id} className="flex flex-col gap-5">
              <Link
                href={`/miasta/${group.city.slug}`}
                className="group/city inline-flex items-baseline gap-3 border-b border-white/10 pb-3 hover:border-white/40 transition-colors"
              >
                <h3 className="text-2xl md:text-3xl lg:text-[2rem] font-bold uppercase -tracking-[0.02em] text-white truncate">
                  {group.city.name}
                </h3>
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/35 tabular-nums">
                  {group.cinemas.length}
                </span>
              </Link>
              <ul className="flex flex-col gap-1.5">
                {group.cinemas.slice(0, CINEMAS_PER_CITY).map((cinema) => (
                  <li key={cinema.id}>
                    <Link
                      href={`/kina/${cinema.slug}`}
                      className="inline-block text-sm md:text-base text-white/55 hover:text-white transition-colors"
                    >
                      {cinema.name}
                    </Link>
                  </li>
                ))}
                {group.cinemas.length > CINEMAS_PER_CITY && (
                  <li className="mt-1 text-[10px] uppercase tracking-[0.25em] text-white/30">
                    +{group.cinemas.length - CINEMAS_PER_CITY} więcej
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 md:px-12 lg:px-16 pb-12 md:pb-16 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
        <Link
          href="/mapa-kin"
          className="group inline-flex items-center gap-4 text-xs md:text-sm uppercase tracking-[0.28em] text-black bg-white hover:bg-white/90 px-8 md:px-10 py-4 md:py-5 transition-colors"
        >
          Otwórz mapę
          <span
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
        <Link
          href="/kina"
          className="group inline-flex items-center gap-4 text-xs md:text-sm uppercase tracking-[0.28em] text-white border border-white/25 hover:border-white hover:bg-white/[0.04] px-8 md:px-10 py-4 md:py-5 transition-colors"
        >
          Wszystkie kina
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
