import { Metadata } from "next";
import FaqPageContent from "./_components/faq-page-content";
import { SITE_URL } from "@/lib/site-config";
import SectionHeader from "@/components/common/section-header";
import JsonLd from "@/components/common/json-ld";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import FAQ_ITEMS from "./faq.json";

const buildFaqJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
});

const FaqPage = () => {
  return (
    <>
      <JsonLd data={buildFaqJsonLd()} />
      <main className="bg-black min-h-screen px-8 md:px-16 pt-28 pb-32 md:pb-40">
        <div className="max-w-[1100px] mx-auto flex flex-col gap-16">
          <div className="flex flex-col gap-6">
            <Breadcrumbs items={[{ name: "FAQ", href: "/faq" }]} />
            <SectionHeader prefix="FAQ" title="Najczęściej zadawane pytania" />
          </div>

          <FaqPageContent />
        </div>
      </main>
    </>
  );
};

export const metadata: Metadata = {
  title: "Najczęściej zadawane pytania o kinach studyjnych",
  description:
    "Odpowiedzi na pytania o seansach specjalnych, repertuarze kin studyjnych, biletach i funkcjach serwisu Klaps. Dowiedz się jak znaleźć klasykę filmową w kinie.",
  keywords: [
    "kina studyjne pytania",
    "seanse specjalne FAQ",
    "jak działa Klaps",
    "FAQ o kinach studyjnych",
  ],
  alternates: {
    canonical: `${SITE_URL}/faq`,
  },
  openGraph: {
    title: "FAQ - Najczęściej zadawane pytania o kinach studyjnych",
    description:
      "Odpowiedzi na pytania o seansach specjalnych, repertuarze kin studyjnych i funkcjach serwisu Klaps.",
  },
};

export default FaqPage;
