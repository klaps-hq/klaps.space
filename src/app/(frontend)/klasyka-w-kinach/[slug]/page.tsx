import React from "react";
import { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { getGenres } from "@/lib/genres";
import { SITE_URL } from "@/lib/site-config";
import { BASE_OPEN_GRAPH, NOINDEX_FOLLOW, pluralPl } from "@/lib/seo";
import { classicFallbackIntro } from "@/lib/listing-copy";
import {
  CLASSIC_PATH,
  ClassicMonth,
  classicMonthRange,
  classicMonthStatus,
  countScreenings,
  fetchClassicScreenings,
  getClassicMonths,
  getLandingIntro,
  isClassicIndexable,
  landingIntroKeys,
  OPEN_AIR_PATH,
  parseClassicMonthSlug,
} from "@/lib/landing-pages";
import SiteHeader from "@/components/common/site-header";
import {
  LandingHeader,
  LandingJsonLd,
  LandingRepertoire,
  LinkGrid,
} from "@/components/common/landing-page";
import Footer from "../../(home)/_components/footer";

export const revalidate = 300;

type ClassicMonthPageProps = {
  params: Promise<{ slug: string }>;
};

export const generateStaticParams = async (): Promise<{ slug: string }[]> =>
  getClassicMonths().map((month) => ({ slug: month.slug }));

/**
 * Only this month and the next have pages. A month that is over redirects
 * to the hub: its screenings are gone, and the hub is where its visitors
 * and links are best served. Anything else is a 404.
 */
const getLiveMonth = (slug: string): ClassicMonth => {
  const month = parseClassicMonthSlug(slug);
  if (!month) notFound();
  const status = classicMonthStatus(month);
  if (status === "past") permanentRedirect(CLASSIC_PATH);
  if (status === "future") notFound();
  return month;
};

const getMonthScreenings = (month: ClassicMonth) =>
  fetchClassicScreenings(classicMonthRange(month)).catch(() => null);

export const generateMetadata = async ({
  params,
}: ClassicMonthPageProps): Promise<Metadata> => {
  const { slug } = await params;
  const month = getLiveMonth(slug);
  const groups = await getMonthScreenings(month);
  const indexable = isClassicIndexable(groups);

  const movies = groups?.length ?? 0;
  const screenings = groups ? countScreenings(groups) : 0;
  const title = `Klasyka w kinach w ${month.locative} ${month.year}`;
  const description =
    movies > 0
      ? `Klasyka w kinach w ${month.locative} ${month.year}: ${movies} ${pluralPl(movies, "film", "filmy", "filmów")} i ${screenings} ${pluralPl(screenings, "seans", "seanse", "seansów")} w kinach w całej Polsce. Sprawdź, gdzie i kiedy obejrzeć klasykę na dużym ekranie.`
      : `Klasyka w kinach w ${month.locative} ${month.year}: seanse filmów sprzed lat w kinach w całej Polsce, uzupełniane na bieżąco.`;
  const url = `${SITE_URL}${CLASSIC_PATH}/${month.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    ...(indexable === false ? NOINDEX_FOLLOW : {}),
    openGraph: { ...BASE_OPEN_GRAPH, type: "website", title, description, url },
    twitter: { card: "summary_large_image", title, description },
  };
};

const ClassicMonthPage = async ({ params }: ClassicMonthPageProps) => {
  const { slug } = await params;
  const month = getLiveMonth(slug);

  const [groups, storedIntro, genres] = await Promise.all([
    getMonthScreenings(month),
    getLandingIntro(landingIntroKeys.classicMonth(month.yearMonth)),
    getGenres(),
  ]);
  const screenings = groups ?? [];
  const path = `${CLASSIC_PATH}/${month.slug}`;
  const label = `${month.name.charAt(0).toUpperCase()}${month.name.slice(1)} ${month.year}`;
  const intro = storedIntro ?? classicFallbackIntro(month.locative, screenings);

  const otherMonths = getClassicMonths().filter(
    (other) => other.yearMonth !== month.yearMonth
  );

  return (
    <main className="bg-black text-white min-h-screen">
      <SiteHeader />
      <LandingJsonLd
        name={`Klasyka w kinach w ${month.locative} ${month.year}`}
        path={path}
        description={intro}
        screenings={screenings}
      />

      <LandingHeader
        breadcrumbs={[
          { name: "Klasyka w kinach", href: CLASSIC_PATH },
          { name: label, href: path },
        ]}
        title={
          <>
            Klasyka w&nbsp;kinach w&nbsp;{month.locative} {month.year}
          </>
        }
        intro={intro}
      />

      <LandingRepertoire
        screenings={screenings}
        genres={genres}
        heading={<>Seanse klasyki w&nbsp;{month.locative}</>}
        emptyDescription={
          <>
            Nie ma jeszcze zapowiedzianych seansów klasyki w&nbsp;
            {month.locative}. Kina publikują repertuar z&nbsp;kilkutygodniowym
            wyprzedzeniem, a my dodajemy go na bieżąco.
          </>
        }
        cta={{ href: CLASSIC_PATH, label: "Klasyka w kinach" }}
      />

      <LinkGrid
        heading="Więcej klasyki i seansów"
        items={[
          ...otherMonths.map((other) => ({
            href: `${CLASSIC_PATH}/${other.slug}`,
            label: `Klasyka w ${other.locative}`,
            meta: String(other.year),
          })),
          { href: CLASSIC_PATH, label: "Klasyka w kinach" },
          { href: "/gatunki", label: "Gatunki" },
          { href: "/rezyserzy", label: "Reżyserzy" },
          { href: OPEN_AIR_PATH, label: "Kino plenerowe" },
        ]}
      />

      <Footer />
    </main>
  );
};

export default ClassicMonthPage;
