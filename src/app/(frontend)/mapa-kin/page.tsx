import React from "react";
import Link from "next/link";
import { getCinemasWithCoordinates } from "@/lib/cinemas";
import { isChainCinema } from "@/lib/cinema-chains";
import { getIndexableSlugs } from "@/lib/sitemap-entries";
import { pluralPl } from "@/lib/seo";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import PageHeading, {
  PageHeadingMuted,
} from "@/components/ui/page-heading";
import SiteHeader from "@/components/common/site-header";
import EmptyState from "@/components/common/empty-state";
import Footer from "../(home)/_components/footer";
import CinemaMapLazy from "./_components/cinema-map-lazy";

export const revalidate = 300;

const TOP_CITIES = 8;

const PROSE_LINK_CLASS =
  "text-white/80 underline underline-offset-4 decoration-white/25 hover:text-white hover:decoration-white transition-colors";

const CinemaMapPage = async () => {
  const [cinemas, indexable] = await Promise.all([
    getCinemasWithCoordinates(),
    getIndexableSlugs(),
  ]);
  // The map also pins multiplexes hosting special screenings, so the lead
  // counts them apart instead of calling every pin "niezależny".
  // Open-air series are seasonal screening spots, not cinemas, and Łódź
  // alone has dozens of them, so they are counted on their own as well.
  const openAirCount = cinemas.filter((c) => c.isOpenAir).length;
  const independent = cinemas.filter(
    (c) => !isChainCinema(c.name) && !c.isOpenAir
  );
  const chainCount = cinemas.filter((c) => isChainCinema(c.name)).length;
  const cityCount = new Set(cinemas.map((c) => c.city.id)).size;
  const byCity = new Map<number, { slug: string; name: string; count: number }>();
  for (const cinema of independent) {
    const entry = byCity.get(cinema.city.id) ?? {
      slug: cinema.city.slug,
      name: cinema.city.name,
      count: 0,
    };
    entry.count += 1;
    byCity.set(cinema.city.id, entry);
  }
  const topCities = [...byCity.values()]
    .filter((city) => !indexable || indexable.cities.has(city.slug))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "pl"))
    .slice(0, TOP_CITIES);

  return (
    <main className="bg-black text-white min-h-screen">
      <SiteHeader />

      <div className="px-6 md:px-12 lg:px-16 pt-8 md:pt-10 pb-4">
        <Breadcrumbs items={[{ name: "Mapa kin", href: "/mapa-kin" }]} />
      </div>

      <header className="px-6 md:px-12 lg:px-16 pt-6 md:pt-8 pb-10 md:pb-14">
        <PageHeading variant="editorial">
          Mapa kin studyjnych.
          <PageHeadingMuted>
            Sprawdź, co gra w&nbsp;Twojej okolicy.
          </PageHeadingMuted>
        </PageHeading>
        <p className="mt-4 md:mt-5 max-w-[64ch] text-base md:text-lg text-white/55 leading-relaxed">
          {independent.length}{" "}
          {pluralPl(independent.length, "kino studyjne", "kina studyjne", "kin studyjnych")}
          {openAirCount > 0 && (
            <>
              , {openAirCount}{" "}
              {pluralPl(openAirCount, "miejsce", "miejsca", "miejsc")} kina
              plenerowego
            </>
          )}
          {chainCount > 0 && (
            <>
              {" "}
              i&nbsp;{chainCount}{" "}
              {pluralPl(chainCount, "kino sieciowe", "kina sieciowe", "kin sieciowych")}{" "}
              z&nbsp;seansami specjalnymi
            </>
          )}{" "}
          w&nbsp;{cityCount} miastach z&nbsp;całej Polski. Kliknij pin, żeby
          zobaczyć szczegóły miejsca i&nbsp;jego aktualny repertuar.
          Przesuwaj i&nbsp;przybliżaj mapę, żeby zawęzić obszar.
        </p>
      </header>

      <section className="px-6 md:px-12 lg:px-16 pt-2 pb-20 md:pb-28">
        {cinemas.length === 0 ? (
          <EmptyState description="Brak kin z danymi lokalizacji do wyświetlenia na mapie." />
        ) : (
          <CinemaMapLazy cinemas={cinemas} />
        )}
      </section>

      {topCities.length > 0 && (
        // Text counterpart of the map: crawlers and screen readers get the
        // same overview as plain links, and the page more than ~120 words.
        <section className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-12 md:pt-16 pb-24 md:pb-32">
          <h2 className="mb-6 md:mb-8 text-2xl md:text-4xl leading-[1.05] -tracking-[0.02em] max-w-[26ch] text-white font-medium">
            Gdzie jest najwięcej kin studyjnych
          </h2>
          <div className="flex flex-col gap-4 max-w-[64ch] text-base md:text-lg text-white/60 leading-relaxed">
            <p>
              Kina studyjne działają zarówno w&nbsp;dużych miastach, jak
              i&nbsp;w&nbsp;mniejszych miejscowościach, gdzie często prowadzą
              je domy kultury. Najwięcej kin studyjnych na mapie mają:{" "}
              {topCities.map((city, index) => (
                <React.Fragment key={city.slug}>
                  {index > 0 && (index === topCities.length - 1 ? " i " : ", ")}
                  <Link href={`/miasta/${city.slug}`} className={PROSE_LINK_CLASS}>
                    {city.name}
                  </Link>{" "}
                  ({city.count})
                </React.Fragment>
              ))}
              .
            </p>
            <p>
              Pełną listę z&nbsp;adresami znajdziesz w&nbsp;spisie{" "}
              <Link href="/kina" className={PROSE_LINK_CLASS}>
                kin studyjnych
              </Link>{" "}
              i&nbsp;na stronach{" "}
              <Link href="/miasta" className={PROSE_LINK_CLASS}>
                miast
              </Link>
              , a&nbsp;bieżący program wszystkich miejsc na jednej liście
              w&nbsp;dziale{" "}
              <Link href="/seanse" className={PROSE_LINK_CLASS}>
                Seanse
              </Link>
              .
            </p>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
};

export default CinemaMapPage;
