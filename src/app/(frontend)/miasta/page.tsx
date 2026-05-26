import React from "react";
import Link from "next/link";
import { getCities } from "@/lib/cities";
import { ICity } from "@/interfaces/ICities";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import SiteHeader from "@/components/common/site-header";
import Footer from "../(home)/_components/footer";

export const revalidate = 300;

const formatCinemasLabel = (n: number) => {
  if (n === 1) return "kino";
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "kina";
  return "kin";
};

const groupByLetter = (cities: ICity[]): [string, ICity[]][] => {
  const sorted = [...cities].sort((a, b) =>
    a.name.localeCompare(b.name, "pl")
  );
  const groups = new Map<string, ICity[]>();
  for (const city of sorted) {
    const letter = city.name[0]?.toUpperCase() ?? "?";
    const bucket = groups.get(letter);
    if (bucket) bucket.push(city);
    else groups.set(letter, [city]);
  }
  return Array.from(groups.entries()).sort(([a], [b]) =>
    a.localeCompare(b, "pl")
  );
};

const CitiesPage = async () => {
  const cities = await getCities();
  const letterGroups = groupByLetter(cities);
  const totalCities = cities.length;
  const totalCinemas = cities.reduce((acc, c) => acc + c.numberOfCinemas, 0);

  return (
    <main className="bg-black text-white min-h-screen">
      <SiteHeader />

      <div className="px-6 md:px-12 lg:px-16 pt-8 md:pt-10 pb-6">
        <Breadcrumbs items={[{ name: "Miasta", href: "/miasta" }]} />
      </div>

      <div className="px-6 md:px-12 lg:px-16 pt-8 md:pt-12 pb-10 md:pb-14">
        <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.05] -tracking-[0.02em] max-w-[26ch]">
          <span className="block text-white font-medium">
            Miasta z&nbsp;kinami studyjnymi.
          </span>
          <span className="block text-white/40">
            Sprawdź repertuar w&nbsp;twojej okolicy.
          </span>
        </h1>
        <p className="mt-4 md:mt-5 max-w-[64ch] text-base md:text-lg text-white/55 leading-relaxed">
          Alfabetyczna lista wszystkich {totalCities} miast, w&nbsp;których
          działają niezależne kina studyjne. Łącznie {totalCinemas} ekranów
          z&nbsp;klasyką, retrospektywami i&nbsp;pokazami specjalnymi.
          Wybierz miasto, żeby zobaczyć lokalne kina i&nbsp;ich aktualne
          repertuary.
        </p>
      </div>

      <div className="px-6 md:px-12 lg:px-16 pb-24 md:pb-32">
        {letterGroups.length === 0 ? (
          <p className="text-white/40 text-sm uppercase tracking-[0.25em]">
            Brak miast do wyświetlenia.
          </p>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-x-12 lg:gap-x-16">
            {letterGroups.map(([letter, citiesInGroup]) => (
              <section
                key={letter}
                className="mb-12 md:mb-16 break-inside-avoid"
              >
                <div className="flex items-baseline gap-3 border-b border-white/10 pb-3 mb-5">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold uppercase -tracking-[0.02em] text-white">
                    {letter}
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
                        className="group flex items-baseline justify-between gap-3"
                      >
                        <span className="text-base md:text-lg text-white/65 group-hover:text-white transition-colors">
                          {city.name}
                        </span>
                        <span className="shrink-0 text-[10px] uppercase tracking-[0.25em] text-white/35 tabular-nums">
                          {city.numberOfCinemas}{" "}
                          {formatCinemasLabel(city.numberOfCinemas)}
                        </span>
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
