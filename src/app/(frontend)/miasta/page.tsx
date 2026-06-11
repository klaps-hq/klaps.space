import React from "react";
import Link from "next/link";
import { getCities } from "@/lib/cities";
import { formatVoivodeship } from "@/lib/voivodeships";
import { ICity } from "@/interfaces/ICities";
import { SITE_URL } from "@/lib/site-config";
import JsonLd from "@/components/common/json-ld";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import PageHeading, {
  PageHeadingMuted,
} from "@/components/ui/page-heading";
import SiteHeader from "@/components/common/site-header";
import SiteSearch from "@/components/common/site-search";
import EmptyState from "@/components/common/empty-state";
import Footer from "../(home)/_components/footer";

export const revalidate = 300;

// Cities with no voivodeship (defensive, should not happen) end up
// in a trailing "Pozostałe" bucket instead of disappearing.
const FALLBACK_GROUP = "pozostałe";

const groupByVoivodeship = (cities: ICity[]): [string, ICity[]][] => {
  const sorted = [...cities].sort((a, b) =>
    a.name.localeCompare(b.name, "pl")
  );
  const groups = new Map<string, ICity[]>();
  for (const city of sorted) {
    const key = city.voivodeship ?? FALLBACK_GROUP;
    const bucket = groups.get(key);
    if (bucket) bucket.push(city);
    else groups.set(key, [city]);
  }
  return Array.from(groups.entries()).sort(([a], [b]) => {
    if (a === FALLBACK_GROUP) return 1;
    if (b === FALLBACK_GROUP) return -1;
    return a.localeCompare(b, "pl");
  });
};

const buildCitiesJsonLd = (cities: readonly ICity[]) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Kina studyjne w miastach Polski",
  url: `${SITE_URL}/miasta`,
  description:
    "Miasta w Polsce z kinami studyjnymi i repertuarem seansów specjalnych.",
  // Freshness signal for AI Overviews: render time equals the moment
  // the city data was last refreshed (ISR).
  dateModified: new Date().toISOString(),
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: cities.length,
    itemListElement: cities.map((city, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}/miasta/${city.slug}`,
      name: city.name,
    })),
  },
});

const CitiesPage = async () => {
  const cities = await getCities();
  const voivodeshipGroups = groupByVoivodeship(cities);
  const totalCities = cities.length;
  const totalCinemas = cities.reduce((acc, c) => acc + c.numberOfCinemas, 0);

  return (
    <main className="bg-black text-white min-h-screen">
      {cities.length > 0 && <JsonLd data={buildCitiesJsonLd(cities)} />}
      <SiteHeader />

      <div className="px-6 md:px-12 lg:px-16 pt-8 md:pt-10 pb-6">
        <Breadcrumbs items={[{ name: "Miasta", href: "/miasta" }]} />
      </div>

      <div className="px-6 md:px-12 lg:px-16 pt-8 md:pt-12 pb-10 md:pb-14">
        <PageHeading variant="editorial">
          Miasta z&nbsp;kinami studyjnymi.
          <PageHeadingMuted>
            Sprawdź repertuar w&nbsp;Twojej okolicy.
          </PageHeadingMuted>
        </PageHeading>
        <p className="mt-4 md:mt-5 max-w-[64ch] text-base md:text-lg text-white/55 leading-relaxed">
          Lista wszystkich {totalCities} miast, w&nbsp;których działają
          niezależne kina studyjne, pogrupowana według województw. Łącznie{" "}
          {totalCinemas} ekranów z&nbsp;klasyką, retrospektywami
          i&nbsp;pokazami specjalnymi. Wybierz miasto, żeby zobaczyć lokalne
          kina i&nbsp;ich aktualne repertuary.
        </p>
        <SiteSearch mode="cities" className="mt-8 md:mt-10 max-w-md" />
      </div>

      <div className="px-6 md:px-12 lg:px-16 pb-24 md:pb-32">
        {voivodeshipGroups.length === 0 ? (
          <EmptyState description="Brak miast do wyświetlenia." />
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-x-12 lg:gap-x-16">
            {voivodeshipGroups.map(([voivodeship, citiesInGroup]) => (
              <section
                key={voivodeship}
                className="mb-12 md:mb-16 break-inside-avoid"
              >
                <div className="flex items-baseline gap-3 border-b border-white/10 pb-3 mb-5">
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-bold uppercase -tracking-[0.02em] text-white">
                    {formatVoivodeship(voivodeship)}
                  </h2>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-white/35 tabular-nums">
                    {citiesInGroup.length}
                  </span>
                </div>
                <ul className="flex flex-col gap-2">
                  {citiesInGroup.map((city) => (
                    <li key={city.id}>
                      <Link
                        href={`/miasta/${city.slug}`}
                        className="text-base md:text-lg text-white/65 hover:text-white transition-colors block truncate"
                      >
                        {city.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
};

export default CitiesPage;
