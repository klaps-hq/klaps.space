import { Metadata } from "next";
import { SITE_URL } from "@/lib/site-config";
import { BASE_OPEN_GRAPH } from "@/lib/seo";

// The CollectionPage JSON-LD lives in page.tsx: a layout would embed the
// full cinema ItemList into the payload of every /kina/[slug] page.

export const metadata: Metadata = {
  title: "Kina studyjne w Polsce",
  description:
    "Pełna lista kin studyjnych i niezależnych w Polsce. Znajdź kino artystyczne w swoim mieście i sprawdź aktualny repertuar seansów specjalnych.",
  alternates: {
    canonical: `${SITE_URL}/kina`,
  },
  // Next replaces (not merges) the parent openGraph object, so locale,
  // siteName and type have to be restated here.
  openGraph: {
    ...BASE_OPEN_GRAPH,
    type: "website",
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

export default function CinemasLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
