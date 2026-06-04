import React from "react";
import Link from "next/link";
import { getCityBySlug } from "@/lib/cities";
import { getCinemas } from "@/lib/cinemas";
import { getGenres } from "@/lib/genres";
import { getScreenings } from "@/lib/screenings";
import { IScreeningGroup } from "@/interfaces/IScreenings";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import SiteHeader from "@/components/common/site-header";
import Footer from "../../(home)/_components/footer";
import CityRepertoire from "./_components/city-repertoire";

export const revalidate = 300;

type SearchParams = {
  genres?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
};

type CityPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
};

const parseGenreIds = (raw: string | undefined): string[] => {
  if (!raw) return [];
  return raw
    .split(",")
    .map((v) => v.trim())
    .filter((v) => v.length > 0 && !Number.isNaN(Number(v)));
};

const mergeScreeningGroups = (
  groupArrays: IScreeningGroup[][]
): IScreeningGroup[] => {
  const map = new Map<number, IScreeningGroup>();
  for (const groups of groupArrays) {
    for (const group of groups) {
      if (!map.has(group.movie.id)) map.set(group.movie.id, group);
    }
  }
  return Array.from(map.values());
};

const CityPage = async ({ params, searchParams }: CityPageProps) => {
  const { slug } = await params;
  const sp = await searchParams;

  const cityData = await getCityBySlug(slug);
  const city = cityData.city;

  const genreIds = parseGenreIds(sp.genres);
  const sharedFilters = {
    cityId: city.id.toString(),
    dateFrom: sp.dateFrom,
    dateTo: sp.dateTo,
    search: sp.search,
  };

  const [{ data: cinemaGroups }, allGenres, screenings] = await Promise.all([
    getCinemas({ cityId: city.id.toString() }),
    getGenres(),
    genreIds.length > 1
      ? Promise.all(
          genreIds.map((id) =>
            getScreenings({ ...sharedFilters, genreId: id })
          )
        ).then(mergeScreeningGroups)
      : getScreenings({
          ...sharedFilters,
          genreId: genreIds[0] ?? null,
        }),
  ]);

  const cinemas = cinemaGroups
    .flatMap((g) => g.cinemas)
    .sort((a, b) => a.name.localeCompare(b.name, "pl"));
  const cinemasCount = cinemas.length;
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
        {city.description && (
          <p className="mt-8 md:mt-10 max-w-[64ch] text-base md:text-lg text-white/65 leading-relaxed">
            {city.description}
          </p>
        )}
      </header>

      {cinemas.length > 0 && (
        <section className="px-6 md:px-12 lg:px-16 pt-12 md:pt-16 pb-12 md:pb-16">
          <h2 className="mb-8 md:mb-10 text-2xl md:text-4xl lg:text-5xl leading-[1.05] -tracking-[0.02em] max-w-[26ch] text-white font-medium">
            Kina w&nbsp;{cityForCopy}
          </h2>
          <div className="flex flex-wrap">
            {cinemas.map((cinema) => (
              <Link
                key={cinema.id}
                href={`/kina/${cinema.slug}`}
                className="group bg-black hover:bg-white/[0.04] transition-colors border border-white/10 -mr-px -mb-px px-5 md:px-6 py-8 md:py-12 flex flex-col items-center justify-center gap-2 min-h-[120px] md:min-h-[160px] basis-1/2 sm:basis-1/3 lg:basis-1/4"
              >
                <span className="text-base md:text-xl lg:text-2xl font-medium uppercase -tracking-[0.01em] text-white/70 group-hover:text-white transition-colors text-center">
                  {cinema.name}
                </span>
                {cinema.street && (
                  <span className="text-[10px] md:text-xs uppercase tracking-[0.22em] text-white/40 text-center">
                    {cinema.street}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      <CityRepertoire
        cityName={city.name}
        cityForCopy={cityForCopy}
        screenings={screenings}
        genres={allGenres}
      />

      <Footer />
    </main>
  );
};

export default CityPage;
