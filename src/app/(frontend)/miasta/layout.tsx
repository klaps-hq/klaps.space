import { Metadata } from "next";
import { SITE_URL } from "@/lib/site-config";
import { BASE_OPEN_GRAPH } from "@/lib/seo";

// The CollectionPage JSON-LD lives in page.tsx: a layout would embed the
// full city ItemList into the payload of every /miasta/[slug] page.

export const metadata: Metadata = {
  title: "Kina studyjne w miastach Polski",
  description:
    "Wybierz miasto i sprawdź kina studyjne w swoim regionie. Repertuar seansów specjalnych, klasyki filmowej i retrospektyw w miastach całej Polski.",
  alternates: {
    canonical: `${SITE_URL}/miasta`,
  },
  // Next replaces (not merges) the parent openGraph object, so locale,
  // siteName and type have to be restated here.
  openGraph: {
    ...BASE_OPEN_GRAPH,
    type: "website",
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

export default function CitiesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
