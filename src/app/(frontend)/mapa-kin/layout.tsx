import { Metadata } from "next";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Mapa kin studyjnych w Polsce",
  description:
    "Interaktywna mapa kin studyjnych i niezależnych w Polsce. Znajdź kino artystyczne blisko siebie i sprawdź repertuar seansów specjalnych.",
  alternates: {
    canonical: `${SITE_URL}/mapa-kin`,
  },
  openGraph: {
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
