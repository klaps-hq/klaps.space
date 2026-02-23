import { Metadata } from "next";
import HowItWorksPageContent from "./_components/how-it-works-page-content";
import { SITE_URL } from "@/lib/site-config";
import SectionHeader from "@/components/common/section-header";

const HowItWorksPage = () => {
  return (
    <main className="bg-black min-h-screen px-8 py-32">
      <div className="max-w-[1100px] mx-auto flex flex-col gap-16">
        <SectionHeader prefix="W trzech krokach" title="Jak to działa" />
        <HowItWorksPageContent />
      </div>
    </main>
  );
};

export const metadata: Metadata = {
  title: "Jak to działa",
  description:
    "Dowiedz się skąd Klaps pobiera repertuar, jak filtruje seanse i jak korzystać z serwisu.",
  alternates: {
    canonical: `${SITE_URL}/jak-to-dziala`,
  },
};

export default HowItWorksPage;
