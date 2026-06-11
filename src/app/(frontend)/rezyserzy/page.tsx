import React from "react";
import { Metadata } from "next";
import { getDirectors } from "@/lib/directors";
import { IDirector } from "@/interfaces/IDirectors";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import PageHeading, { PageHeadingMuted } from "@/components/ui/page-heading";
import SiteHeader from "@/components/common/site-header";
import JsonLd from "@/components/common/json-ld";
import { SITE_URL } from "@/lib/site-config";
import {
  BASE_OPEN_GRAPH,
  buildPaginationMeta,
  parsePageParam,
} from "@/lib/seo";
import Footer from "../(home)/_components/footer";
import DirectorsBrowser from "./_components/directors-browser";

export const revalidate = 300;

const PAGE_SIZE = 40;

interface DirectorsSearchParams {
  page?: string;
}

interface DirectorsPageProps {
  searchParams: Promise<DirectorsSearchParams>;
}

export const generateMetadata = async ({
  searchParams,
}: DirectorsPageProps): Promise<Metadata> => {
  const { page } = await searchParams;
  const description =
    "Przeglądaj reżyserów, których kino wraca na duży ekran w polskich kinach studyjnych. Retrospektywy, klasyka filmowa i seanse specjalne.";
  const url = `${SITE_URL}/rezyserzy`;

  // Plain pagination stays indexable: unique title, self-canonical and
  // rel prev/next, so the deeper parts of the listing keep their crawl
  // path. getDirectors() is deduplicated against the page render's call
  // by Next's fetch memoization.
  const { data: directors } = await getDirectors();
  const totalPages = Math.max(1, Math.ceil(directors.length / PAGE_SIZE));
  const currentPage = Math.min(parsePageParam(page), totalPages);

  const title =
    currentPage >= 2
      ? `Reżyserzy - filmy i seanse w kinach studyjnych (strona ${currentPage})`
      : "Reżyserzy - filmy i seanse w kinach studyjnych";
  const { canonical, pagination } = buildPaginationMeta(
    url,
    currentPage,
    totalPages
  );

  return {
    title,
    description,
    alternates: { canonical },
    pagination,
    openGraph: {
      ...BASE_OPEN_GRAPH,
      type: "website",
      title,
      description:
        "Reżyserzy, których filmy wracają na duży ekran. Seanse specjalne w kinach studyjnych w Polsce.",
      url: canonical,
    },
  };
};

// Only directors with an active repertoire are worth surfacing in the
// ItemList; including the full long tail would bloat the payload.
const buildDirectorsJsonLd = (directors: readonly IDirector[]) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Reżyserzy",
  url: `${SITE_URL}/rezyserzy`,
  description:
    "Reżyserzy, których filmy grają na seansach specjalnych w kinach studyjnych w Polsce.",
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: directors.length,
    itemListElement: directors.map((director, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}/rezyserzy/${director.slug}`,
      name: director.name,
    })),
  },
});

// Directors with the most upcoming screenings lead; those without surface
// further down, ordered by filmography size then name.
const byRelevance = (a: IDirector, b: IDirector): number =>
  b.upcomingScreeningsCount - a.upcomingScreeningsCount ||
  b.moviesCount - a.moviesCount ||
  a.name.localeCompare(b.name, "pl");

const DirectorsPage = async ({ searchParams }: DirectorsPageProps) => {
  const { page } = await searchParams;
  const { data: directors } = await getDirectors();
  const sorted = [...directors].sort(byRelevance);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(parsePageParam(page), totalPages);

  const withRepertoire = sorted.filter(
    (director) => director.upcomingScreeningsCount > 0
  );

  return (
    <main className="bg-black text-white min-h-screen">
      {withRepertoire.length > 0 && (
        <JsonLd data={buildDirectorsJsonLd(withRepertoire)} />
      )}
      <SiteHeader />

      <div className="px-6 md:px-12 lg:px-16 pt-8 md:pt-10 pb-6">
        <Breadcrumbs items={[{ name: "Reżyserzy", href: "/rezyserzy" }]} />
      </div>

      <div className="px-6 md:px-12 lg:px-16 pt-8 md:pt-12 pb-10 md:pb-14">
        <PageHeading variant="editorial">
          Reżyserzy.
          <PageHeadingMuted>Twórcy na dużym ekranie.</PageHeadingMuted>
        </PageHeading>
        <p className="mt-4 md:mt-5 max-w-[64ch] text-base md:text-lg text-white/55 leading-relaxed">
          Reżyserzy, których kino wraca na duży ekran w&nbsp;polskich kinach
          studyjnych. Retrospektywy, klasyka filmowa i&nbsp;seanse specjalne.
          Wybierz nazwisko i&nbsp;zobacz filmografię oraz aktualny repertuar.
        </p>
      </div>

      <DirectorsBrowser
        directors={sorted}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={PAGE_SIZE}
      />

      <Footer />
    </main>
  );
};

export default DirectorsPage;
