import React from "react";
import Link from "next/link";
import { getGenres } from "@/lib/genres";

const FEATURED_COUNT = 10;

const Genres = async () => {
  const genres = await getGenres();
  if (genres.length === 0) return null;

  const featured = genres.slice(0, FEATURED_COUNT);

  return (
    <section className="relative bg-black text-white border-t border-white/10">
      <div className="px-6 md:px-12 lg:px-16 pt-24 md:pt-32 pb-10 md:pb-14">
        <h2 className="text-3xl md:text-5xl lg:text-6xl leading-[1.05] -tracking-[0.02em] max-w-[26ch]">
          <span className="block text-white font-medium">
            Przeglądaj po gatunku.
          </span>
          <span className="block text-white/40">
            Filtruj seanse po nastroju wieczoru.
          </span>
        </h2>
        <p className="mt-4 md:mt-5 max-w-[64ch] text-base md:text-lg text-white/55 leading-relaxed">
          Od dramatów po anime, od dokumentów po kino eksperymentalne. Wybierz
          gatunek i&nbsp;zobacz wszystkie filmy z&nbsp;tej kategorii
          pokazywane w&nbsp;polskich kinach studyjnych.
        </p>
      </div>

      <div className="px-6 md:px-12 lg:px-16 pb-12 md:pb-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 border-t border-l border-white/10">
          {featured.map((genre) => (
            <Link
              key={genre.id}
              href={`/gatunki/${genre.slug}`}
              className="group bg-black hover:bg-white/[0.04] transition-colors border-r border-b border-white/10 px-5 md:px-6 py-8 md:py-12 flex items-center justify-center min-h-[120px] md:min-h-[160px]"
            >
              <span className="text-base md:text-xl lg:text-2xl font-medium uppercase -tracking-[0.01em] text-white/70 group-hover:text-white transition-colors text-center">
                {genre.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="px-6 md:px-12 lg:px-16 pb-12 md:pb-16 flex justify-center">
        <Link
          href="/gatunki"
          className="group inline-flex items-center gap-4 text-xs md:text-sm uppercase tracking-[0.28em] text-white border border-white/25 hover:border-white hover:bg-white/[0.04] px-8 md:px-10 py-4 md:py-5 transition-colors"
        >
          Wszystkie gatunki
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

export default Genres;
