import { Metadata } from "next";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Mapa kin studyjnych w Polsce",
  description:
    "Interaktywna mapa kin studyjnych i niezaleznych w Polsce. Znajdz kino artystyczne blisko siebie i sprawdz repertuar seansow specjalnych.",
  keywords: [
    "mapa kin studyjnych",
    "kina studyjne na mapie",
    "kina niezalezne mapa",
    "kino artystyczne blisko mnie",
  ],
  alternates: {
    canonical: `${SITE_URL}/mapa-kin`,
  },
  openGraph: {
    title: "Mapa kin studyjnych w Polsce",
    description:
      "Interaktywna mapa kin studyjnych i niezaleznych w Polsce. Znajdz kino artystyczne blisko siebie.",
    url: `${SITE_URL}/mapa-kin`,
    images: [
      {
        url: `${SITE_URL}/klaps-og.png`,
        width: 1200,
        height: 630,
        alt: "Mapa kin studyjnych w Polsce",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mapa kin studyjnych w Polsce",
    description:
      "Interaktywna mapa kin studyjnych i niezaleznych w Polsce. Znajdz kino artystyczne blisko siebie.",
    images: [`${SITE_URL}/klaps-og.png`],
  },
};

export default function CinemaMapLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
