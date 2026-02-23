import { Metadata } from "next";
import HowItWorksPageContent from "./_components/how-it-works-page-content";
import { SITE_URL } from "@/lib/site-config";
import SectionHeader from "@/components/common/section-header";
import Breadcrumbs from "@/components/ui/breadcrumbs";

const HowItWorksPage = () => {
  return (
    <main className="bg-black min-h-screen px-8 py-32">
      <div className="max-w-[1100px] mx-auto flex flex-col gap-16">
        <div className="flex flex-col gap-6">
          <Breadcrumbs
            items={[{ name: "Jak to działa", href: "/jak-to-dziala" }]}
          />
          <SectionHeader prefix="W trzech krokach" title="Jak to działa" />
        </div>
        <HowItWorksPageContent />
      </div>
    </main>
  );
};

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

export default HowItWorksPage;
