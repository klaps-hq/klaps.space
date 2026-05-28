import React from "react";
import { getCinemasWithCoordinates } from "@/lib/cinemas";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import SiteHeader from "@/components/common/site-header";
import Footer from "../(home)/_components/footer";
import CinemaMapLazy from "./_components/cinema-map-lazy";

export const revalidate = 300;

const CinemaMapPage = async () => {
  const cinemas = await getCinemasWithCoordinates();
  const cityCount = new Set(cinemas.map((c) => c.city.id)).size;

  return (
    <main className="bg-black text-white min-h-screen">
      <SiteHeader />

      <div className="px-6 md:px-12 lg:px-16 pt-8 md:pt-10 pb-4">
        <Breadcrumbs items={[{ name: "Mapa kin", href: "/mapa-kin" }]} />
      </div>

      <header className="px-6 md:px-12 lg:px-16 pt-6 md:pt-8 pb-10 md:pb-14">
        <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.05] -tracking-[0.02em] max-w-[26ch]">
          <span className="block text-white font-medium">
            Mapa kin studyjnych.
          </span>
          <span className="block text-white/40">
            Sprawdź co gra w&nbsp;twojej okolicy.
          </span>
        </h1>
        <p className="mt-4 md:mt-5 max-w-[64ch] text-base md:text-lg text-white/55 leading-relaxed">
          {cinemas.length} niezależnych ekranów w&nbsp;{cityCount} miastach
          z&nbsp;całej Polski. Kliknij pin, żeby zobaczyć szczegóły miejsca
          i&nbsp;jego aktualny repertuar. Używaj scroll i&nbsp;zoom, żeby
          zawęzić region.
        </p>
      </header>

      <section className="px-6 md:px-12 lg:px-16 pt-2 pb-20 md:pb-28">
        <CinemaMapLazy cinemas={cinemas} />
        {cinemas.length === 0 && (
          <p className="mt-6 text-center text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/40">
            Brak kin z&nbsp;danymi lokalizacji do wyświetlenia.
          </p>
        )}
      </section>

      <Footer />
    </main>
  );
};

export default CinemaMapPage;
