import { Metadata } from "next";
import { SITE_URL } from "@/lib/site-config";
import { BASE_OPEN_GRAPH } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Mapa kin studyjnych w Polsce",
  description:
    "Interaktywna mapa kin studyjnych i niezależnych w Polsce. Znajdź kino artystyczne blisko siebie i sprawdź repertuar seansów specjalnych.",
  alternates: {
    canonical: `${SITE_URL}/mapa-kin`,
  },
  // Next replaces (not merges) the parent openGraph object, so locale,
  // siteName and type have to be restated here.
  openGraph: {
    ...BASE_OPEN_GRAPH,
    type: "website",
    title: "Mapa kin studyjnych w Polsce",
    description:
      "Interaktywna mapa kin studyjnych i niezależnych w Polsce. Znajdź kino artystyczne blisko siebie.",
    url: `${SITE_URL}/mapa-kin`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Mapa kin studyjnych w Polsce",
    description:
      "Interaktywna mapa kin studyjnych i niezależnych w Polsce. Znajdź kino artystyczne blisko siebie.",
  },
};

export default function CinemaMapLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
