import React from "react";
import Link from "next/link";
import { getCinemas, getCinemasWithCoordinates } from "@/lib/cinemas";
import { isChainCinema } from "@/lib/cinema-chains";
import { getIndexableSlugs } from "@/lib/sitemap-entries";
import { pluralPl } from "@/lib/seo";
import { getScreenings } from "@/lib/screenings";
import { SITE_URL } from "@/lib/site-config";
import JsonLd from "@/components/common/json-ld";
import type { MapCinema } from "./_components/poland-street-map";
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
  const [cinemas, indexable, screenings, catalog] = await Promise.all([
    getCinemasWithCoordinates(),
    getIndexableSlugs(),
    getScreenings(),
    getCinemas({ limit: 1000 }),
  ]);
  // Films with an upcoming screening per venue, shown in the map popup.
  const filmsByCinema = new Map<number, Set<number>>();
  for (const group of screenings) {
    for (const { cinema } of group.screenings) {
      const films = filmsByCinema.get(cinema.id) ?? new Set<number>();
      films.add(group.movie.id);
      filmsByCinema.set(cinema.id, films);
    }
  }
  // Only the fields the map draws cross into the client bundle.
  const mapCinemas: MapCinema[] = cinemas.map((c) => ({
    slug: c.slug,
    name: c.name,
    city: c.city.name,
    street: c.street,
    lat: c.latitude as number,
    lon: c.longitude as number,
    films: filmsByCinema.get(c.id)?.size ?? 0,
    isChain: isChainCinema(c.name),
    isOpenAir: Boolean(c.isOpenAir),
  }));
  // Year-round studio venues on the map, for the city ranking below it.
  // Open-air series are seasonal spots (Łódź alone has dozens) and chains
  // are not "kina studyjne", so both are left out of it.
  const independent = cinemas.filter(
    (c) => !isChainCinema(c.name) && !c.isOpenAir
  );
  // The lead quotes the whole catalogue, the same numbers as /kina; the
  // map can only pin venues with coordinates (audit #10: /kina said 383
  // studio cinemas, the map 380).
  const catalogCinemas = catalog.data.flatMap((g) =>
    g.cinemas.map((c) => ({ ...c, cityId: g.city.id }))
  );
  const catalogChain = catalogCinemas.filter((c) => isChainCinema(c.name)).length;
  const catalogOpenAir = catalogCinemas.filter(
    (c) => !isChainCinema(c.name) && c.isOpenAir
  ).length;
  const catalogStudio = catalogCinemas.length - catalogChain - catalogOpenAir;
  const catalogCities = new Set(catalogCinemas.map((c) => c.cityId)).size;
  const unpinned = Math.max(0, catalogCinemas.length - cinemas.length);
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
      {/* The map itself is a canvas, so the page describes its content as
          a collection: the venue counts and the cities listed below it. */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Mapa kin studyjnych w Polsce",
          url: `${SITE_URL}/mapa-kin`,
          isPartOf: { "@id": `${SITE_URL}/#website` },
          ...(topCities.length > 0 && {
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: topCities.length,
              itemListElement: topCities.map((city, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: city.name,
                url: `${SITE_URL}/miasta/${city.slug}`,
              })),
            },
          }),
        }}
      />
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
          {catalogStudio}{" "}
          {pluralPl(catalogStudio, "kino studyjne", "kina studyjne", "kin studyjnych")}
          {catalogOpenAir > 0 && (
            <>
              , {catalogOpenAir}{" "}
              {pluralPl(catalogOpenAir, "miejsce", "miejsca", "miejsc")} kina
              plenerowego
            </>
          )}
          {catalogChain > 0 && (
            <>
              {" "}
              i&nbsp;{catalogChain}{" "}
              {pluralPl(catalogChain, "kino sieciowe", "kina sieciowe", "kin sieciowych")}{" "}
              z&nbsp;seansami specjalnymi
            </>
          )}{" "}
          w&nbsp;{catalogCities} miastach z&nbsp;całej Polski.
          {unpinned > 0 && (
            <>
              {" "}
              Na mapie jest {cinemas.length} z&nbsp;nich, {unpinned}{" "}
              {pluralPl(unpinned, "nie ma", "nie mają", "nie ma")} jeszcze
              współrzędnych.
            </>
          )}{" "}
          Kliknij punkt, żeby
          zobaczyć szczegóły miejsca i&nbsp;jego aktualny repertuar, albo
          liczbę, żeby przybliżyć skupisko kin. Po przybliżeniu widać ulice
          i&nbsp;budynki w&nbsp;okolicy kina.
        </p>
      </header>

      <section className="px-6 md:px-12 lg:px-16 pt-2 pb-20 md:pb-28">
        {cinemas.length === 0 ? (
          <EmptyState description="Brak kin z danymi lokalizacji do wyświetlenia na mapie." />
        ) : (
          <CinemaMapLazy cinemas={mapCinemas} />
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
