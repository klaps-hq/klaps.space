import React from "react";
import Link from "next/link";
import { getCityPageData } from "@/lib/cities";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import SiteHeader from "@/components/common/site-header";
import Footer from "../../(home)/_components/footer";
import ScreeningCard from "../../(home)/_components/screenings/screening-card";

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

type CityPageProps = {
  params: Promise<{ slug: string }>;
};

const CityPage = async ({ params }: CityPageProps) => {
  const { slug } = await params;
  const { city, cinemaGroups, screenings } = await getCityPageData(slug);

  const cinemas = cinemaGroups
    .flatMap((g) => g.cinemas)
    .sort((a, b) => a.name.localeCompare(b.name, "pl"));
  const cinemasCount = cinemas.length;
  const moviesCount = screenings.length;
  const cityForCopy = city.nameDeclinated ?? city.name;

  return (
    <main className="bg-black text-white min-h-screen">
      <SiteHeader />

      <div className="px-6 md:px-12 lg:px-16 pt-8 md:pt-10 pb-4">
        <Breadcrumbs
          items={[
            { name: "Miasta", href: "/miasta" },
            { name: city.name },
          ]}
        />
      </div>

      <header className="px-6 md:px-12 lg:px-16 pt-6 md:pt-8 pb-12 md:pb-16">
        <Link
          href="/miasta"
          className="inline-block w-fit text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/40 hover:text-white/80 transition-colors mb-3 md:mb-4"
        >
          Miasto
        </Link>
        <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-medium uppercase -tracking-[0.03em] leading-[0.95] text-white max-w-[18ch]">
          {city.name}
        </h1>
        <div className="mt-5 md:mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-[10px] md:text-xs uppercase tracking-[0.22em] text-white/45">
          <span>
            {cinemasCount}{" "}
            {formatPlural(cinemasCount, [
              "kino studyjne",
              "kina studyjne",
              "kin studyjnych",
            ])}
          </span>
          <span aria-hidden="true">·</span>
          <span>
            {moviesCount}{" "}
            {formatPlural(moviesCount, [
              "film w repertuarze",
              "filmy w repertuarze",
              "filmów w repertuarze",
            ])}
          </span>
        </div>
        {city.description && (
          <p className="mt-8 md:mt-10 max-w-[64ch] text-base md:text-lg text-white/65 leading-relaxed">
            {city.description}
          </p>
        )}
      </header>

      {cinemas.length > 0 && (
        <section className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-12 md:pt-16 pb-12 md:pb-16">
          <div className="mb-8 md:mb-10 flex items-end justify-between gap-6 flex-wrap">
            <h2 className="text-2xl md:text-4xl lg:text-5xl leading-[1.05] -tracking-[0.02em] max-w-[26ch] text-white font-medium">
              Kina w&nbsp;{cityForCopy}
            </h2>
            <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/40 tabular-nums">
              {cinemasCount}{" "}
              {formatPlural(cinemasCount, ["kino", "kina", "kin"])}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 border-t border-l border-white/10">
            {cinemas.map((cinema) => (
              <Link
                key={cinema.id}
                href={`/kina/${cinema.slug}`}
                className="group bg-black hover:bg-white/[0.04] transition-colors border-r border-b border-white/10 flex flex-col gap-2 px-5 md:px-6 py-5 md:py-7"
              >
                <span className="text-base md:text-lg lg:text-xl font-medium uppercase -tracking-[0.01em] text-white/80 group-hover:text-white transition-colors">
                  {cinema.name}
                </span>
                {cinema.street && (
                  <span className="text-[10px] md:text-xs uppercase tracking-[0.22em] text-white/40 truncate">
                    {cinema.street}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-12 md:pt-16 pb-20 md:pb-28">
        <div className="mb-8 md:mb-10 flex items-end justify-between gap-6 flex-wrap">
          <h2 className="text-2xl md:text-4xl lg:text-5xl leading-[1.05] -tracking-[0.02em] max-w-[26ch] text-white font-medium">
            Co gra w&nbsp;{cityForCopy}
          </h2>
          {moviesCount > 0 && (
            <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/40 tabular-nums">
              {moviesCount}{" "}
              {moviesCount === 1 ? "film" : "filmów"}
            </span>
          )}
        </div>

        {screenings.length === 0 ? (
          <div className="flex flex-col items-start gap-6 py-4">
            <p className="text-base md:text-lg text-white/55 max-w-[48ch]">
              Brak aktualnych seansów w&nbsp;{cityForCopy}. Sprawdź repertuar
              w&nbsp;innych miastach.
            </p>
            <Link
              href="/miasta"
              className="group inline-flex items-center gap-3 text-xs md:text-sm uppercase tracking-[0.28em] text-white border border-white/25 hover:border-white hover:bg-white/[0.04] px-7 md:px-9 py-4 md:py-5 transition-colors"
            >
              Inne miasta
              <span
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-x-4 md:gap-x-6 gap-y-10 md:gap-y-12">
            {screenings.map((group) => (
              <ScreeningCard key={group.movie.id} group={group} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
};

export default CityPage;
