import { Metadata } from "next";
import AboutPageContent from "./_components/about-page-content";
import { SITE_URL } from "@/lib/site-config";
import SectionHeader from "@/components/common/section-header";
import Breadcrumbs from "@/components/ui/breadcrumbs";

const AboutPage = () => {
  return (
    <main className="bg-black min-h-screen px-8 md:px-16 lg:px-24 pt-28 pb-32 md:pb-40">
      <div className="max-w-[1100px] mx-auto flex flex-col gap-16">
        <div className="flex flex-col gap-6">
          <Breadcrumbs items={[{ name: "O projekcie", href: "/o-projekcie" }]} />
          <SectionHeader prefix="O projekcie" title="Klaps" />
        </div>
        <AboutPageContent />
      </div>
    </main>
  );
};

export const metadata: Metadata = {
  title: "O Klaps - przewodnik po kinach studyjnych w Polsce",
  description:
    "Czym jest Klaps, jaki problem rozwiązuje i dlaczego kino klasyczne zasługuje na jedno, czytelne miejsce w sieci. Przewodnik po seansach specjalnych w kinach studyjnych.",
  keywords: [
    "Klaps",
    "przewodnik po kinach studyjnych",
    "seanse specjalne Polska",
    "klasyka filmowa w kinie",
  ],
  alternates: {
    canonical: `${SITE_URL}/o-projekcie`,
  },
  openGraph: {
    title: "O projekcie Klaps - przewodnik po kinach studyjnych",
    description:
      "Czym jest Klaps i dlaczego kino klasyczne zasługuje na jedno, czytelne miejsce w sieci.",
  },
};

export default AboutPage;
