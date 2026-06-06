import { Metadata } from "next";
import JsonLd from "@/components/common/json-ld";
import { getCinemas } from "@/lib/cinemas";
import { SITE_URL } from "@/lib/site-config";
import { ICinemaGroup } from "@/interfaces/ICinema";

const buildCitiesJsonLd = (cinemaGroups: readonly ICinemaGroup[]) => {
  // Only cities with cinemas - empty city pages are noindexed.
  const cities = cinemaGroups
    .filter((group) => group.cinemas.length > 0)
    .map((group) => group.city);

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Kina studyjne w miastach Polski",
    url: `${SITE_URL}/miasta`,
    description:
      "Miasta w Polsce z kinami studyjnymi i repertuarem seansów specjalnych.",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: cities.length,
      itemListElement: cities.map((city, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${SITE_URL}/miasta/${city.slug}`,
        name: city.name,
      })),
    },
  };
};

export const metadata: Metadata = {
  title: "Kina studyjne w miastach Polski",
  description:
    "Wybierz miasto i sprawdź kina studyjne w swoim regionie. Repertuar seansów specjalnych, klasyki filmowej i retrospektyw w miastach całej Polski.",
  alternates: {
    canonical: `${SITE_URL}/miasta`,
  },
  openGraph: {
    title: "Kina studyjne w miastach Polski",
    description:
      "Wybierz miasto i sprawdź kina studyjne w swoim regionie. Repertuar seansów specjalnych, klasyki filmowej i retrospektyw w miastach całej Polski.",
    url: `${SITE_URL}/miasta`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Kina studyjne w miastach Polski",
    description:
      "Wybierz miasto i sprawdź kina studyjne w swoim regionie. Repertuar seansów specjalnych, klasyki filmowej i retrospektyw w miastach całej Polski.",
  },
};

export default async function CitiesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // getCinemas falls back to an empty list on API errors.
  const { data: cinemaGroups } = await getCinemas();

  return (
    <>
      {cinemaGroups.length > 0 && (
        <JsonLd data={buildCitiesJsonLd(cinemaGroups)} />
      )}
      {children}
    </>
  );
}
