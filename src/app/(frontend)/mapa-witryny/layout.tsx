import { Metadata } from "next";
import { SITE_URL } from "@/lib/site-config";
import { BASE_OPEN_GRAPH } from "@/lib/seo";

const TITLE = "Mapa witryny";
const DESCRIPTION =
  "Mapa witryny Klaps: wszystkie sekcje serwisu w jednym miejscu. Seanse, kina, miasta, gatunki, reżyserzy i blog o kinie studyjnym w Polsce.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}/mapa-witryny`,
  },
  // Next replaces (not merges) the parent openGraph object, so locale,
  // siteName and type have to be restated here.
  openGraph: {
    ...BASE_OPEN_GRAPH,
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/mapa-witryny`,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function SiteMapLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
