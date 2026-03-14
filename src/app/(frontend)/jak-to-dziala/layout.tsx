import { Metadata } from "next";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Jak działa Klaps - przewodnik po serwisie",
  description:
    "Dowiedz się skąd Klaps pobiera repertuar kin studyjnych, jak filtruje seanse specjalne i jak znaleźć klasykę filmową w kinie blisko Ciebie.",
  keywords: [
    "jak działa Klaps",
    "repertuar kin studyjnych",
    "seanse specjalne wyszukiwanie",
  ],
  alternates: {
    canonical: `${SITE_URL}/jak-to-dziala`,
  },
  openGraph: {
    title: "Jak działa Klaps - przewodnik po serwisie",
    description:
      "Dowiedz się skąd Klaps pobiera repertuar kin studyjnych i jak znaleźć seanse specjalne w swoim mieście.",
  },
};

export default function HowItWorksLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
