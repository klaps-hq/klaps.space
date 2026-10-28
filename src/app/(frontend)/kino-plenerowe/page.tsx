import React from "react";
import { Metadata } from "next";
import { getGenres } from "@/lib/genres";
import { SITE_URL } from "@/lib/site-config";
import { BASE_OPEN_GRAPH, NOINDEX_FOLLOW, pluralPl } from "@/lib/seo";
import { openAirFallbackIntro } from "@/lib/listing-copy";
import {
  CLASSIC_PATH,
  countScreenings,
  getLandingIntro,
  getOpenAirCities,
  getOpenAirPageData,
  landingIntroKeys,
  OPEN_AIR_PATH,
} from "@/lib/landing-pages";
import SiteHeader from "@/components/common/site-header";
import RecentRepertoire from "@/components/common/recent-repertoire";
import {
  LandingHeader,
  LandingJsonLd,
  LandingRepertoire,
  LinkGrid,
} from "@/components/common/landing-page";
import Footer from "../(home)/_components/footer";

export const revalidate = 300;

const TITLE = "Kino plenerowe: seanse pod gołym niebem w Polsce";
const URL = `${SITE_URL}${OPEN_AIR_PATH}`;

export const generateMetadata = async (): Promise<Metadata> => {
  const [cities, { upcoming, indexable }] = await Promise.all([
    getOpenAirCities().catch(() => null),
    getOpenAirPageData(),
  ]);
  const upcomingCount = upcoming ? countScreenings(upcoming) : 0;
  const cityNames = (cities ?? []).slice(0, 3).map(({ city }) => city.name);

  const description =
    (upcomingCount > 0
      ? `${upcomingCount} ${pluralPl(upcomingCount, "seans", "seanse", "seansów")} kina plenerowego w najbliższych tygodniach. `
      : "Kino plenerowe w Polsce: pokazy pod gołym niebem. ") +
    (cityNames.length > 0
      ? `Miejsca i repertuar w miastach takich jak ${cityNames.join(", ")}.`
      : "Miejsca i repertuar w całej Polsce.");

  return {
    title: TITLE,
    description,
    alternates: { canonical: URL },
    ...(indexable === false ? NOINDEX_FOLLOW : {}),
    openGraph: {
      ...BASE_OPEN_GRAPH,
      type: "website",
      title: TITLE,
      description,
      url: URL,
    },
    twitter: { card: "summary_large_image", title: TITLE, description },
  };
};

const OpenAirPage = async () => {
  const [cities, { upcoming, season }, storedIntro, genres] = await Promise.all(
    [
      // Tolerated here (unlike on the city pages): the hub is prerendered
      // at build time, when there is no API.
      getOpenAirCities().catch(() => []),
      getOpenAirPageData(),
      getLandingIntro(landingIntroKeys.openAir),
      getGenres(),
    ]
  );
  const screenings = upcoming ?? [];
  const seasonItems = season ?? [];

  const intro =
    storedIntro ??
    openAirFallbackIntro(
      null,
      cities.flatMap(({ cinemas }) => cinemas.map((cinema) => cinema.name)),
      screenings,
      seasonItems.map((item) => item.movie.title)
    );

  return (
    <main className="bg-black text-white min-h-screen">
      <SiteHeader />
      <LandingJsonLd
        name="Kino plenerowe w Polsce"
        path={OPEN_AIR_PATH}
        description={intro}
        screenings={screenings}
      />

      <LandingHeader
        breadcrumbs={[{ name: "Kino plenerowe", href: OPEN_AIR_PATH }]}
        title="Kino plenerowe"
        intro={intro}
      />

      <LinkGrid
        heading="Kino plenerowe w miastach"
        items={cities.map(({ city, cinemas }) => ({
          href: `${OPEN_AIR_PATH}/${city.slug}`,
          label: city.name,
          meta: `${cinemas.length} ${pluralPl(cinemas.length, "miejsce", "miejsca", "miejsc")}`,
        }))}
      />

      <LandingRepertoire
        screenings={screenings}
        genres={genres}
        heading="Najbliższe seanse plenerowe"
        emptyDescription={
          <>
            Nie ma teraz zapowiedzianych seansów plenerowych. Kina letnie
            publikują repertuar przed sezonem, a my dodajemy go na bieżąco.
          </>
        }
        cta={{ href: CLASSIC_PATH, label: "Klasyka w kinach" }}
      />

      <RecentRepertoire
        heading="Ostatni sezon"
        description="Filmy pokazywane w kinach plenerowych w ostatnich 12 miesiącach, od najnowszego seansu."
        items={seasonItems}
      />

      <Footer />
    </main>
  );
};

export default OpenAirPage;
