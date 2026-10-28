import React from "react";
import { Metadata } from "next";
import { getDirectors } from "@/lib/directors";
import { IDirector } from "@/interfaces/IDirectors";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import PageHeading, { PageHeadingMuted } from "@/components/ui/page-heading";
import SiteHeader from "@/components/common/site-header";
import JsonLd from "@/components/common/json-ld";
import { SITE_URL } from "@/lib/site-config";
import { BASE_OPEN_GRAPH } from "@/lib/seo";
import Footer from "../(home)/_components/footer";
import DirectorsBrowser, {
  type DirectorsBrowserItem,
} from "./_components/directors-browser";

// Static ISR: the page reads no searchParams (old ?page=N URLs are
// redirected to the hub in the proxy), so it is cached like the other hubs.
export const revalidate = 300;

export const generateMetadata = async (): Promise<Metadata> => {
  const title = "Reżyserzy - filmy i seanse w kinach studyjnych";
  const description =
    "Przeglądaj reżyserów, których kino wraca na duży ekran w polskich kinach studyjnych. Retrospektywy, klasyka filmowa i seanse specjalne.";
  const url = `${SITE_URL}/rezyserzy`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      ...BASE_OPEN_GRAPH,
      type: "website",
      title,
      description:
        "Reżyserzy, których filmy wracają na duży ekran. Seanse specjalne w kinach studyjnych w Polsce.",
      url,
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

// Directors with the most upcoming screenings lead, then by filmography
// size and name.
const byRelevance = (a: IDirector, b: IDirector): number =>
  b.upcomingScreeningsCount - a.upcomingScreeningsCount ||
  b.moviesCount - a.moviesCount ||
  a.name.localeCompare(b.name, "pl");

// Only the fields the cards render cross into the client component. The
// full records carry bios, and shipping ~1200 of them made every page of
// the old paginated hub weigh ~0.9 MB of HTML.
const toBrowserItem = (director: IDirector): DirectorsBrowserItem => ({
  id: director.id,
  slug: director.slug,
  name: director.name,
  photoUrl: director.photoUrl,
  moviesCount: director.moviesCount,
  upcomingScreeningsCount: director.upcomingScreeningsCount,
});

const DirectorsPage = async () => {
  const { data: directors } = await getDirectors();

  // The hub lists only directors whose films are on screen. The long tail
  // without screenings (98% of ~1200) are noindex pages; 31 paginated pages
  // of links to them were the bulk of the crawl Google spent here. Those
  // pages stay reachable from their films.
  const withRepertoire = directors
    .filter((director) => director.upcomingScreeningsCount > 0)
    .sort(byRelevance);

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
          Reżyserzy, których filmy grają teraz w&nbsp;polskich kinach
          studyjnych. Retrospektywy, klasyka filmowa i&nbsp;seanse specjalne.
          Wybierz nazwisko i&nbsp;zobacz filmografię oraz aktualny repertuar.
        </p>
      </div>

      <DirectorsBrowser directors={withRepertoire.map(toBrowserItem)} />

      <Footer />
    </main>
  );
};

export default DirectorsPage;
