import { Metadata } from "next";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Gatunki filmowe - klasyka i retrospektywy w kinach",
  description:
    "Przeglądaj filmy klasyczne według gatunku. Dramat, thriller, komedia i inne gatunki w seansach specjalnych w kinach studyjnych w Polsce.",
  keywords: [
    "gatunki filmowe",
    "filmy klasyczne gatunki",
    "dramat kino studyjne",
    "seanse specjalne gatunek",
  ],
  alternates: {
    canonical: `${SITE_URL}/gatunki`,
  },
  openGraph: {
    title: "Gatunki filmowe - klasyka i retrospektywy w kinach studyjnych",
    description:
      "Przeglądaj filmy klasyczne według gatunku. Seanse specjalne w kinach studyjnych w Polsce.",
  },
};

export default function GenresLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
