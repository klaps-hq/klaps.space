import { Metadata } from "next";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "O Klaps - przewodnik po kinach studyjnych w Polsce",
  description:
    "Czym jest Klaps, jaki problem rozwiązuje i dlaczego kino klasyczne zasługuje na jedno, czytelne miejsce w sieci. Przewodnik po seansach specjalnych w kinach studyjnych.",
  alternates: {
    canonical: `${SITE_URL}/o-projekcie`,
  },
  openGraph: {
    title: "O projekcie Klaps - przewodnik po kinach studyjnych",
    description:
      "Czym jest Klaps i dlaczego kino klasyczne zasługuje na jedno, czytelne miejsce w sieci.",
  },
};

export default function AboutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
