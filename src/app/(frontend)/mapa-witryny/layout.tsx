import { Metadata } from "next";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Mapa witryny",
  description:
    "Mapa witryny serwisu Klaps. Przeglądaj wszystkie dostępne strony i podstrony w jednym miejscu.",
  alternates: {
    canonical: `${SITE_URL}/mapa-witryny`,
  },
};

export default function SitemapPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
