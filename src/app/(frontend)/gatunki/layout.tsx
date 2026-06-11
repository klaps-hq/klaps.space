import { Metadata } from "next";
import { SITE_URL } from "@/lib/site-config";

// The CollectionPage JSON-LD lives in page.tsx: a layout would embed the
// full genre ItemList into the payload of every /gatunki/[slug] page.

export const metadata: Metadata = {
  title: "Gatunki filmowe - klasyka i retrospektywy w kinach",
  description:
    "Przeglądaj klasykę filmową według gatunku. Dramaty, thrillery, komedie i inne filmy na seansach specjalnych w kinach studyjnych w Polsce.",
  alternates: {
    canonical: `${SITE_URL}/gatunki`,
  },
  openGraph: {
    title: "Gatunki filmowe - klasyka i retrospektywy w kinach studyjnych",
    description:
      "Przeglądaj klasykę filmową według gatunku. Seanse specjalne w kinach studyjnych w Polsce.",
    url: `${SITE_URL}/gatunki`,
  },
};

export default function GenresLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
