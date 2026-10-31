import { Metadata } from "next";
import { FOUNDER, SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Robert Siński, twórca serwisu",
  description:
    "Kto stoi za klaps.space: Robert Siński, programista z Katowic, który zbudował przewodnik po seansach specjalnych i klasyce w kinach studyjnych.",
  alternates: {
    canonical: `${SITE_URL}/o-tworcy`,
  },
  openGraph: {
    locale: "pl_PL",
    type: "profile",
    title: "Robert Siński - twórca Klaps",
    description:
      "Kto stoi za klaps.space i jak powstaje przewodnik po seansach specjalnych w kinach studyjnych.",
    url: FOUNDER.url,
  },
};

export default function FounderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
