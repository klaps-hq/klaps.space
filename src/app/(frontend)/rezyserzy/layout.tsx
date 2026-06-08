import { Metadata } from "next";
import JsonLd from "@/components/common/json-ld";
import { getDirectors } from "@/lib/directors";
import { SITE_URL } from "@/lib/site-config";
import { BASE_OPEN_GRAPH } from "@/lib/seo";
import { IDirector } from "@/interfaces/IDirectors";

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

export const metadata: Metadata = {
  title: "Reżyserzy - filmy i seanse w kinach studyjnych",
  description:
    "Przeglądaj reżyserów, których kino wraca na duży ekran w polskich kinach studyjnych. Retrospektywy, klasyka filmowa i seanse specjalne.",
  alternates: {
    canonical: `${SITE_URL}/rezyserzy`,
  },
  openGraph: {
    ...BASE_OPEN_GRAPH,
    type: "website",
    title: "Reżyserzy - kino autorskie w kinach studyjnych",
    description:
      "Reżyserzy, których filmy wracają na duży ekran. Seanse specjalne w kinach studyjnych w Polsce.",
    url: `${SITE_URL}/rezyserzy`,
  },
};

export default async function DirectorsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let directors: IDirector[] = [];
  try {
    directors = (await getDirectors()).data.filter(
      (director) => director.upcomingScreeningsCount > 0
    );
  } catch {
    // JSON-LD is an enhancement - render the page without it on API errors.
  }

  return (
    <>
      {directors.length > 0 && (
        <JsonLd data={buildDirectorsJsonLd(directors)} />
      )}
      {children}
    </>
  );
}
