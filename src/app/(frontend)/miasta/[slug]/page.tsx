import React, { Suspense } from "react";
import Link from "next/link";
import { Metadata } from "next";
import { getCityBySlug } from "@/lib/cities";
import { getCinemas } from "@/lib/cinemas";
import { getGenres } from "@/lib/genres";
import { getScreenings, getScreeningsLastUpdated } from "@/lib/screenings";
import { SITE_URL } from "@/lib/site-config";
import {
  BASE_OPEN_GRAPH,
  NOINDEX_FOLLOW,
  formatPlDate,
  pluralPl,
} from "@/lib/seo";
import { cityFallbackIntro } from "@/lib/listing-copy";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import PageHeading from "@/components/ui/page-heading";
import SiteHeader from "@/components/common/site-header";
import SectionLoader from "@/components/ui/section-loader";
import Footer from "../../(home)/_components/footer";
import CityRepertoire from "./_components/city-repertoire";

// Polish locative preposition: "we" before a w-/f- consonant cluster
// (we Wrocławiu, we Włocławku, we Fromborku), otherwise "w" (w Krakowie).
const wPrep = (locative: string): "w" | "we" =>
  /^[wWfF][bcćdfghjklłmnńprsśtwzźż]/.test(locative) ? "we" : "w";

// ISR: cached HTML revalidated every 5 minutes. The repertoire filters
// (genres, dates, search) are applied client-side in CityRepertoire,
// so this page never reads searchParams and stays statically cacheable.
export const revalidate = 300;

type CityPageProps = {
  params: Promise<{ slug: string }>;
};

// Prebuild cities that have cinemas so bots never hit a cold render.
// Other slugs still render on demand (dynamicParams defaults to true).
export const generateStaticParams = async (): Promise<{ slug: string }[]> => {
  try {
    const { data: groups } = await getCinemas();
    return groups
      .filter((group) => group.cinemas.length > 0)
      .map((group) => ({ slug: group.city.slug }));
  } catch {
    return [];
  }
};

export const generateMetadata = async ({
  params,
}: CityPageProps): Promise<Metadata> => {
  const { slug } = await params;
  const { city, screenings: rawScreenings } = await getCityBySlug(slug);

  const cinemasResponse = await getCinemas({ cityId: city.id.toString() });
  const cinemasCount = cinemasResponse.data.flatMap((g) => g.cinemas).length;
  const screeningGroups = Array.isArray(rawScreenings)
    ? rawScreenings
    : [...(rawScreenings?.data ?? [])];
  const screeningsCount = screeningGroups.reduce(
    (sum, group) => sum + group.screenings.length,
    0
  );

  const title = `Kina studyjne w ${city.nameDeclinated} - repertuar seansów specjalnych`;
  const counts =
    screeningsCount > 0
      ? `${cinemasCount} ${pluralPl(cinemasCount, "kino", "kina", "kin")} i ${screeningsCount} ${pluralPl(screeningsCount, "nadchodzący seans", "nadchodzące seanse", "nadchodzących seansów")}`
      : `${cinemasCount} ${pluralPl(cinemasCount, "kino studyjne", "kina studyjne", "kin studyjnych")}`;
  const description =
    cinemasCount > 0
      ? `${counts} w ${city.nameDeclinated}. Seanse specjalne, klasyka filmowa i retrospektywy - sprawdź aktualny repertuar kin.`
      : `Kina studyjne i niezależne w ${city.nameDeclinated}. Aktualne seanse specjalne, klasyka filmowa i retrospektywy.`;
  const url = `${SITE_URL}/miasta/${city.slug}`;

  // A city without cinemas is thin content; keep it out of the index.
  // Query-param duplicates (filters) are handled by the canonical alone.
  const noindex = cinemasCount === 0;

  return {
    title,
    description,
    ...(noindex ? NOINDEX_FOLLOW : { alternates: { canonical: url } }),
    openGraph: {
      ...BASE_OPEN_GRAPH,
      type: "website",
      title,
      description,
      url,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
};

const CityPage = async ({ params }: CityPageProps) => {
  const { slug } = await params;

  const cityData = await getCityBySlug(slug);
  const city = cityData.city;

  // Full unfiltered repertoire - CityRepertoire narrows it down
  // client-side based on the URL params.
  const [{ data: cinemaGroups }, allGenres, screenings, lastUpdated] =
    await Promise.all([
      getCinemas({ cityId: city.id.toString() }),
      getGenres(),
      getScreenings({ cityId: city.id.toString() }),
      getScreeningsLastUpdated({ cityId: city.id.toString() }),
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
        {city.voivodeship && (
          // Canonical lowercase name reads correctly after "województwo"
          // (both nominative); CSS uppercases it visually.
          <p className="mb-4 md:mb-5 text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/45">
            Województwo {city.voivodeship}
          </p>
        )}
        {/* H1 carries the target keyword ("kina studyjne w [miasto]") rather
            than a bare city name, with the correct w/we preposition. */}
        <PageHeading variant="detail" className="max-w-[20ch]">
          Kina studyjne {wPrep(cityForCopy)}&nbsp;{cityForCopy}
        </PageHeading>
        {city.description ? (
          <p className="mt-8 md:mt-10 max-w-[64ch] text-base md:text-lg text-white/65 leading-relaxed">
            {city.description}
          </p>
        ) : (
          cinemasCount > 0 && (
            // Generated intro keeps description-less city pages from being
            // thin content - unique copy via the live cinema count and the
            // nearest upcoming titles.
            <p className="mt-8 md:mt-10 max-w-[64ch] text-base md:text-lg text-white/65 leading-relaxed">
              {cityFallbackIntro(
                wPrep(cityForCopy) === "we" ? "We" : "W",
                cityForCopy,
                cinemasCount,
                screenings
              )}
            </p>
          )
        )}
        {cinemasCount > 0 && (
          // Visible freshness signal: newest screening updatedAt for this city.
          <p className="mt-5 text-[10px] md:text-xs uppercase tracking-[0.25em] text-white/35">
            Repertuar zaktualizowano: {formatPlDate(lastUpdated ?? new Date())}
          </p>
        )}
      </header>

      {cinemas.length > 0 && (
        <section className="px-6 md:px-12 lg:px-16 pt-12 md:pt-16 pb-12 md:pb-16">
          <h2 className="mb-8 md:mb-10 text-2xl md:text-4xl lg:text-5xl leading-[1.05] -tracking-[0.02em] max-w-[26ch] text-white font-medium">
            Kina {wPrep(cityForCopy)}&nbsp;{cityForCopy}
          </h2>
          {/* Borders live on the cards (not the container) so lines end with
              the last card instead of running across empty grid columns.
              Negative margins collapse the doubled inner borders; opaque
              #1a1a1a (white/10 on black) keeps overlaps from brightening. */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pt-px pl-px">
            {cinemas.map((cinema) => (
              <Link
                key={cinema.id}
                href={`/kina/${cinema.slug}`}
                className="group bg-black hover:bg-white/[0.04] transition-colors border border-[#1a1a1a] -mt-px -ml-px px-4 md:px-5 py-5 md:py-6 flex flex-col gap-1"
              >
                <span className="text-sm md:text-base font-medium uppercase -tracking-[0.01em] text-white/65 group-hover:text-white transition-colors">
                  {cinema.name}
                </span>
                {cinema.street && (
                  <span className="text-[10px] md:text-xs uppercase tracking-[0.22em] text-white/35">
                    {cinema.street}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Suspense: useSearchParams() in the client repertoire needs a
          boundary during static prerender (CSR bailout). */}
      <Suspense fallback={<SectionLoader label="Ładowanie repertuaru" />}>
        <CityRepertoire
          cityForCopy={cityForCopy}
          screenings={screenings}
          genres={allGenres}
        />
      </Suspense>

      <Footer />
    </main>
  );
};

export default CityPage;
