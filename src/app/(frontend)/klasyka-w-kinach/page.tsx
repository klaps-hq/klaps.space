import React from "react";
import { Metadata } from "next";
import { getGenres } from "@/lib/genres";
import { SITE_URL } from "@/lib/site-config";
import { BASE_OPEN_GRAPH, NOINDEX_FOLLOW, pluralPl } from "@/lib/seo";
import { classicFacts, classicFallbackIntro } from "@/lib/listing-copy";
import {
  CLASSIC_MIN_AGE_YEARS,
  CLASSIC_PATH,
  countScreenings,
  fetchClassicScreenings,
  getClassicMonths,
  getLandingIntro,
  isClassicIndexable,
  landingIntroKeys,
  OPEN_AIR_PATH,
} from "@/lib/landing-pages";
import SiteHeader from "@/components/common/site-header";
import {
  LandingHeader,
  LandingJsonLd,
  LandingRepertoire,
  LinkGrid,
} from "@/components/common/landing-page";
import Footer from "../(home)/_components/footer";

export const revalidate = 300;

const TITLE = "Klasyka w kinach: seanse starych filmów na dużym ekranie";
const URL = `${SITE_URL}${CLASSIC_PATH}`;

// The default 30-day window, same as the rest of the site's listings.
const getHubScreenings = () => fetchClassicScreenings().catch(() => null);

export const generateMetadata = async (): Promise<Metadata> => {
  const groups = await getHubScreenings();
  const movies = groups?.length ?? 0;
  const screenings = groups ? countScreenings(groups) : 0;
  const description =
    movies > 0
      ? `Klasyka w kinach: ${movies} ${pluralPl(movies, "film", "filmy", "filmów")} sprzed co najmniej ${CLASSIC_MIN_AGE_YEARS} lat i ${screenings} ${pluralPl(screenings, "seans", "seanse", "seansów")} w najbliższych 30 dniach. Sprawdź, gdzie obejrzeć klasykę na dużym ekranie.`
      : `Klasyka w kinach: filmy sprzed co najmniej ${CLASSIC_MIN_AGE_YEARS} lat na dużym ekranie, w kinach w całej Polsce.`;

  return {
    title: TITLE,
    description,
    alternates: { canonical: URL },
    ...(isClassicIndexable(groups) === false ? NOINDEX_FOLLOW : {}),
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

const ClassicPage = async () => {
  const [groups, storedIntro, genres] = await Promise.all([
    getHubScreenings(),
    getLandingIntro(landingIntroKeys.classic),
    getGenres(),
  ]);
  const screenings = groups ?? [];
  const intro = storedIntro ?? classicFallbackIntro(null, screenings);
  const facts = classicFacts(screenings);

  return (
    <main className="bg-black text-white min-h-screen">
      <SiteHeader />
      <LandingJsonLd
        name="Klasyka w kinach"
        path={CLASSIC_PATH}
        description={intro}
        screenings={screenings}
      />

      <LandingHeader
        breadcrumbs={[{ name: "Klasyka w kinach", href: CLASSIC_PATH }]}
        title={<>Klasyka w&nbsp;kinach</>}
        intro={facts ? `${intro} ${facts}` : intro}
      />

      <LinkGrid
        heading="Klasyka miesiąc po miesiącu"
        items={getClassicMonths().map((month) => ({
          href: `${CLASSIC_PATH}/${month.slug}`,
          label: `Klasyka w ${month.locative}`,
          meta: String(month.year),
        }))}
      />

      <LandingRepertoire
        screenings={screenings}
        genres={genres}
        heading="Najbliższe seanse klasyki"
        emptyDescription={
          <>
            Nie ma teraz zapowiedzianych seansów klasyki. Repertuar
            uzupełniamy na bieżąco, zajrzyj ponownie wkrótce.
          </>
        }
        cta={{ href: "/seanse", label: "Wszystkie seanse" }}
      />

      <LinkGrid
        heading="Przeglądaj dalej"
        items={[
          { href: "/gatunki", label: "Gatunki" },
          { href: "/rezyserzy", label: "Reżyserzy" },
          { href: OPEN_AIR_PATH, label: "Kino plenerowe" },
          // The hub answers "where", the post answers "why"; linked both
          // ways so the two stop competing for the same query.
          {
            href: "/blog/dlaczego-warto-ogladac-klasyke-kina-na-duzym-ekranie",
            label: "Dlaczego klasyka na dużym ekranie",
          },
          { href: "/w-liczbach", label: "Klasyka w liczbach" },
        ]}
      />

      <Footer />
    </main>
  );
};

export default ClassicPage;
