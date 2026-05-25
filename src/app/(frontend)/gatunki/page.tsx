import React from "react";
import Link from "next/link";
import { getGenres } from "@/lib/genres";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import Footer from "../(home)/_components/footer";

export const revalidate = 300;

const GenresPage = async () => {
  const genres = await getGenres();
  const sortedGenres = [...genres].sort((a, b) =>
    a.name.localeCompare(b.name, "pl")
  );

  return (
    <main className="bg-black text-white min-h-screen">
      <div className="px-6 md:px-12 lg:px-16 pt-12 md:pt-16 pb-6">
        <Breadcrumbs items={[{ name: "Gatunki", href: "/gatunki" }]} />
      </div>

      <div className="px-6 md:px-12 lg:px-16 pt-8 md:pt-12 pb-10 md:pb-14">
        <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.05] -tracking-[0.02em] max-w-[26ch]">
          <span className="block text-white font-medium">
            Gatunki filmowe.
          </span>
          <span className="block text-white/40">
            Filtruj seanse po nastroju wieczoru.
          </span>
        </h1>
        <p className="mt-4 md:mt-5 max-w-[64ch] text-base md:text-lg text-white/55 leading-relaxed">
          Pełna lista gatunków filmowych dostępnych w&nbsp;polskich kinach
          studyjnych. Klasyka, retrospektywy, dokumenty, kino autorskie, anime
          i&nbsp;eksperymenty. Wybierz kategorię i&nbsp;zobacz wszystkie
          seanse z&nbsp;niej.
        </p>
      </div>

      <div className="px-6 md:px-12 lg:px-16 pb-24 md:pb-32">
        {sortedGenres.length === 0 ? (
          <p className="text-white/40 text-sm uppercase tracking-[0.25em]">
            Brak gatunków do wyświetlenia.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 border-t border-l border-white/10">
            {sortedGenres.map((genre) => (
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
        )}
      </div>

      <Footer />
    </main>
  );
};

export default GenresPage;
