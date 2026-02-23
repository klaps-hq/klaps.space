import { Metadata } from "next";
import AboutPageContent from "./_components/about-page-content";
import { SITE_URL } from "@/lib/site-config";
import SectionHeader from "@/components/common/section-header";

const AboutPage = () => {
  return (
    <main className="bg-black min-h-screen px-8 md:px-16 lg:px-24 pt-28 pb-32 md:pb-40">
      <div className="max-w-[1100px] mx-auto flex flex-col gap-16">
        <SectionHeader prefix="O projekcie" title="Klaps" />
        <AboutPageContent />
      </div>
    </main>
  );
};

export const metadata: Metadata = {
  title: "O projekcie",
  description:
    "Czym jest Klaps, jaki problem rozwiązuje i dlaczego kino klasyczne zasługuje na jedno, czytelne miejsce w sieci.",
  alternates: {
    canonical: `${SITE_URL}/o-projekcie`,
  },
};

export default AboutPage;
