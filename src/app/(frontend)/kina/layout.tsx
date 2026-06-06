import { Metadata } from "next";
import JsonLd from "@/components/common/json-ld";
import { getCinemas } from "@/lib/cinemas";
import { SITE_URL } from "@/lib/site-config";
import { ICinemaGroup } from "@/interfaces/ICinema";

const buildCinemasJsonLd = (cinemaGroups: readonly ICinemaGroup[]) => {
  const cinemas = cinemaGroups.flatMap((group) => group.cinemas);

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Kina studyjne w Polsce",
    url: `${SITE_URL}/kina`,
    description:
      "Pełna lista kin studyjnych i niezależnych w Polsce wraz z repertuarem seansów specjalnych.",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: cinemas.length,
      itemListElement: cinemas.map((cinema, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${SITE_URL}/kina/${cinema.slug}`,
        name: cinema.name,
      })),
    },
  };
};

export const metadata: Metadata = {
  title: "Kina studyjne w Polsce",
  description:
    "Pełna lista kin studyjnych i niezależnych w Polsce. Znajdź kino artystyczne w swoim mieście i sprawdź aktualny repertuar seansów specjalnych.",
  alternates: {
    canonical: `${SITE_URL}/kina`,
  },
  openGraph: {
    title: "Kina studyjne w Polsce",
    description:
      "Pełna lista kin studyjnych i niezależnych w Polsce. Znajdź kino artystyczne w swoim mieście i sprawdź aktualny repertuar seansów specjalnych.",
    url: `${SITE_URL}/kina`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Kina studyjne w Polsce",
    description:
      "Pełna lista kin studyjnych i niezależnych w Polsce. Znajdź kino artystyczne w swoim mieście i sprawdź aktualny repertuar seansów specjalnych.",
  },
};

export default async function CinemasLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // getCinemas falls back to an empty list on API errors.
  const { data: cinemaGroups } = await getCinemas();

  return (
    <>
      {cinemaGroups.length > 0 && (
        <JsonLd data={buildCinemasJsonLd(cinemaGroups)} />
      )}
      {children}
    </>
  );
}
