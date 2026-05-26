import React from "react";
import Link from "next/link";
import { getCinemas } from "@/lib/cinemas";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import SiteHeader from "@/components/common/site-header";
import Footer from "../(home)/_components/footer";

export const revalidate = 300;

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

const CinemasPage = async () => {
  const { data: cinemaGroups } = await getCinemas({ limit: 1000 });
  const sortedGroups = [...cinemaGroups].sort((a, b) =>
    a.city.name.localeCompare(b.city.name, "pl")
  );
  const totalCinemas = sortedGroups.reduce(
    (acc, g) => acc + g.cinemas.length,
    0
  );
  const totalCities = sortedGroups.length;

  return (
    <main className="bg-black text-white min-h-screen">
      <SiteHeader />

      <div className="px-6 md:px-12 lg:px-16 pt-8 md:pt-10 pb-6">
        <Breadcrumbs items={[{ name: "Kina", href: "/kina" }]} />
      </div>

      <div className="px-6 md:px-12 lg:px-16 pt-8 md:pt-12 pb-10 md:pb-14">
        <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.05] -tracking-[0.02em] max-w-[26ch]">
          <span className="block text-white font-medium">
            Kina studyjne w&nbsp;Polsce.
          </span>
          <span className="block text-white/40">
            Niezależne ekrany z&nbsp;autorskim programem.
          </span>
        </h1>
        <p className="mt-4 md:mt-5 max-w-[64ch] text-base md:text-lg text-white/55 leading-relaxed">
          Pełna lista {totalCinemas}{" "}
          {formatPlural(totalCinemas, [
            "kina studyjnego",
            "kin studyjnych",
            "kin studyjnych",
          ])}{" "}
          w&nbsp;{totalCities}{" "}
          {formatPlural(totalCities, ["mieście", "miastach", "miastach"])}{" "}
          w&nbsp;Polsce. Niezależne miejsca z&nbsp;autorskim repertuarem.
          Klasyka, retrospektywy, pokazy specjalne i&nbsp;kuratorowane cykle.
        </p>
      </div>

      <div className="px-6 md:px-12 lg:px-16 pb-24 md:pb-32">
        {sortedGroups.length === 0 ? (
          <p className="text-white/40 text-sm uppercase tracking-[0.25em]">
            Brak kin do wyświetlenia.
          </p>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-x-12 lg:gap-x-16">
            {sortedGroups.map((group) => (
              <section
                key={group.city.id}
                className="mb-12 md:mb-16 break-inside-avoid"
              >
                <div className="flex items-baseline gap-3 border-b border-white/10 pb-3 mb-5">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold uppercase -tracking-[0.02em]">
                    <Link
                      href={`/miasta/${group.city.slug}`}
                      className="text-white hover:text-white/70 transition-colors"
                    >
                      {group.city.name}
                    </Link>
                  </h2>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-white/35 tabular-nums">
                    {group.cinemas.length}
                  </span>
                </div>
                <ul className="flex flex-col gap-2">
                  {group.cinemas.map((cinema) => (
                    <li key={cinema.id}>
                      <Link
                        href={`/kina/${cinema.slug}`}
                        className="group flex items-baseline justify-between gap-3"
                      >
                        <span className="text-base md:text-lg text-white/65 group-hover:text-white transition-colors min-w-0 truncate">
                          {cinema.name}
                        </span>
                        {cinema.street && (
                          <span className="hidden md:block shrink-0 max-w-[50%] truncate text-[10px] uppercase tracking-[0.25em] text-white/35 text-right">
                            {cinema.street}
                          </span>
                        )}
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

export default CinemasPage;
