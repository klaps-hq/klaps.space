import React from "react";
import Link from "next/link";
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

const MapTeaser = async () => {
  const { data: groups } = await getCinemas({ limit: 1000 });
  const cinemaCount = groups.reduce((acc, g) => acc + g.cinemas.length, 0);
  const cityCount = groups.length;

  return (
    <section className="relative bg-black text-white border-t border-white/10">
      <div className="px-6 md:px-12 lg:px-16 pt-24 md:pt-32 pb-24 md:pb-32">
        <div className="flex flex-col items-center text-center gap-8 md:gap-10">
          <h2 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.05] -tracking-[0.02em] max-w-[26ch]">
            <span className="block text-white font-medium">
              Mapa polskich kin studyjnych.
            </span>
            <span className="block text-white/40">
              Sprawdź co gra w&nbsp;twojej okolicy.
            </span>
          </h2>
          <p className="max-w-[64ch] text-base md:text-lg text-white/55 leading-relaxed">
            {cinemaCount}{" "}
            {formatPlural(cinemaCount, [
              "niezależny ekran",
              "niezależne ekrany",
              "niezależnych ekranów",
            ])}{" "}
            w&nbsp;{cityCount}{" "}
            {formatPlural(cityCount, ["mieście", "miastach", "miastach"])}{" "}
            na&nbsp;jednej mapie. Kliknij pin, żeby zobaczyć aktualny
            repertuar i&nbsp;informacje o&nbsp;miejscu.
          </p>
          <Link
            href="/mapa-kin"
            className="group mt-2 md:mt-4 inline-flex items-center gap-4 text-xs md:text-sm uppercase tracking-[0.28em] text-white border border-white/25 hover:border-white hover:bg-white/[0.04] px-8 md:px-10 py-4 md:py-5 transition-colors"
          >
            Otwórz mapę
            <span
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MapTeaser;
