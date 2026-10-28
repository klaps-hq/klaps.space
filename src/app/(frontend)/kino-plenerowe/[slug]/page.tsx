import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGenres } from "@/lib/genres";
import { getIndexableSlugs } from "@/lib/sitemap-entries";
import { SITE_URL } from "@/lib/site-config";
import { BASE_OPEN_GRAPH, inPlace, NOINDEX_FOLLOW, pluralPl } from "@/lib/seo";
import { openAirFallbackIntro } from "@/lib/listing-copy";
import {
  CLASSIC_PATH,
  countScreenings,
  countSeasonScreenings,
  getLandingIntro,
  getOpenAirCities,
  getOpenAirPageData,
  landingIntroKeys,
  OPEN_AIR_PATH,
  OpenAirCity,
} from "@/lib/landing-pages";
import SiteHeader from "@/components/common/site-header";
import RecentRepertoire from "@/components/common/recent-repertoire";
import {
  LandingHeader,
  LandingJsonLd,
  LandingRepertoire,
  LinkGrid,
} from "@/components/common/landing-page";
import Footer from "../../(home)/_components/footer";

// ISR like the other listing pages; filters run client-side.
export const revalidate = 300;

type OpenAirCityPageProps = {
  params: Promise<{ slug: string }>;
};

export const generateStaticParams = async (): Promise<{ slug: string }[]> => {
  try {
    return (await getOpenAirCities()).map(({ city }) => ({ slug: city.slug }));
  } catch {
    return [];
  }
};

/**
 * The city's open-air venues, or a 404 for a city without any. A failed
 * venue fetch throws instead: a 404 cached by ISR would drop a real page.
 */
const getCityOrNotFound = async (
  slug: string
): Promise<{ entry: OpenAirCity; all: OpenAirCity[] }> => {
  const all = await getOpenAirCities();
  const entry = all.find(({ city }) => city.slug === slug);
  if (!entry) notFound();
  return { entry, all };
};

export const generateMetadata = async ({
  params,
}: OpenAirCityPageProps): Promise<Metadata> => {
  const { slug } = await params;
  const { entry } = await getCityOrNotFound(slug);
  const { city, cinemas } = entry;
  const { upcoming, season, indexable } = await getOpenAirPageData(city);

  const where = inPlace(city.nameDeclinated);
  const upcomingCount = upcoming ? countScreenings(upcoming) : 0;
  const seasonCount = season ? countSeasonScreenings(season) : 0;
  const venues = `${cinemas.length} ${pluralPl(cinemas.length, "miejsce", "miejsca", "miejsc")}`;

  const title = `Kino plenerowe ${where}: seanse i miejsca`;
  const description =
    upcomingCount > 0
      ? `Kino plenerowe ${where}: ${upcomingCount} ${pluralPl(upcomingCount, "seans", "seanse", "seansów")} pod gołym niebem w najbliższych tygodniach, ${venues}. Sprawdź, gdzie i kiedy grają.`
      : seasonCount > 0
        ? `Kino plenerowe ${where}: ${venues} z pokazami pod gołym niebem i ${seasonCount} ${pluralPl(seasonCount, "seans", "seanse", "seansów")} w ostatnim sezonie. Zobacz, co grano.`
        : `Kino plenerowe ${where}: ${venues} z pokazami pod gołym niebem. Seanse pojawią się tu, gdy kina opublikują letni repertuar.`;
  const url = `${SITE_URL}${OPEN_AIR_PATH}/${city.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    ...(indexable === false ? NOINDEX_FOLLOW : {}),
    openGraph: { ...BASE_OPEN_GRAPH, type: "website", title, description, url },
    twitter: { card: "summary_large_image", title, description },
  };
};

const OpenAirCityPage = async ({ params }: OpenAirCityPageProps) => {
  const { slug } = await params;
  const { entry, all } = await getCityOrNotFound(slug);
  const { city, cinemas } = entry;

  const [{ upcoming, season }, storedIntro, genres, indexableSlugs] =
    await Promise.all([
      getOpenAirPageData(city),
      getLandingIntro(landingIntroKeys.openAirCity(city.slug)),
      getGenres(),
      getIndexableSlugs(),
    ]);
  const screenings = upcoming ?? [];
  const seasonItems = season ?? [];

  const where = inPlace(city.nameDeclinated);
  const path = `${OPEN_AIR_PATH}/${city.slug}`;
  const intro =
    storedIntro ??
    openAirFallbackIntro(
      city.nameDeclinated,
      cinemas.map((cinema) => cinema.name),
      screenings,
      seasonItems.map((item) => item.movie.title)
    );

  return (
    <main className="bg-black text-white min-h-screen">
      <SiteHeader />
      <LandingJsonLd
        name={`Kino plenerowe ${where}`}
        path={path}
        description={intro}
        screenings={screenings}
      />

      <LandingHeader
        breadcrumbs={[
          { name: "Kino plenerowe", href: OPEN_AIR_PATH },
          { name: city.name, href: path },
        ]}
        title={<>Kino plenerowe {where}</>}
        intro={intro}
      />

      <LandingRepertoire
        screenings={screenings}
        genres={genres}
        hideCity
        heading={<>Seanse plenerowe {where}</>}
        emptyDescription={
          <>
            Nie ma teraz zapowiedzianych seansów plenerowych {where}. Kina
            letnie publikują repertuar przed sezonem, a my dodajemy go na
            bieżąco.
          </>
        }
        cta={{ href: OPEN_AIR_PATH, label: "Kino plenerowe w Polsce" }}
      />

      <LinkGrid
        heading={<>Miejsca pokazów {where}</>}
        items={cinemas.map((cinema) => ({
          // Only venues whose own page is indexable get a link; the rest
          // are noindex pages and would only spend crawl budget.
          href:
            !indexableSlugs || indexableSlugs.cinemas.has(cinema.slug)
              ? `/kina/${cinema.slug}`
              : undefined,
          label: cinema.name,
          meta: cinema.street ?? undefined,
        }))}
      />

      <RecentRepertoire
        heading={<>Ostatni sezon {where}</>}
        description="Filmy pokazywane w kinach plenerowych w ostatnich 12 miesiącach, od najnowszego seansu."
        items={seasonItems}
      />

      <LinkGrid
        heading="Kino plenerowe w innych miastach"
        items={[
          ...all
            .filter((other) => other.city.slug !== city.slug)
            .map((other) => ({
              href: `${OPEN_AIR_PATH}/${other.city.slug}`,
              label: other.city.name,
              meta: `${other.cinemas.length} ${pluralPl(other.cinemas.length, "miejsce", "miejsca", "miejsc")}`,
            })),
          { href: CLASSIC_PATH, label: "Klasyka w kinach" },
        ]}
      />

      <Footer />
    </main>
  );
};

export default OpenAirCityPage;
