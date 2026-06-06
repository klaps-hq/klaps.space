import { Metadata } from "next";
import JsonLd from "@/components/common/json-ld";
import { SITE_URL } from "@/lib/site-config";
import { FAQ_SECTIONS } from "./faq-data";

// JSON-LD is built from the same source as the visible page content,
// Google guidelines require FAQPage questions/answers to be present
// on the page.
const buildFaqJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_SECTIONS.flatMap((section) =>
    section.questions.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.aText,
      },
    })),
  ),
});

export const metadata: Metadata = {
  title: "FAQ - pytania o kina studyjne i seanse specjalne",
  description:
    "Odpowiedzi na najczęstsze pytania o seanse specjalne, repertuar kin studyjnych i działanie serwisu Klaps. Dowiedz się, jak znaleźć klasykę filmową w kinie.",
  alternates: {
    canonical: `${SITE_URL}/faq`,
  },
  openGraph: {
    title: "FAQ - pytania o kina studyjne i seanse specjalne",
    description:
      "Odpowiedzi na najczęstsze pytania o seanse specjalne, repertuar kin studyjnych i działanie serwisu Klaps.",
  },
};

export default function FaqLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <JsonLd data={buildFaqJsonLd()} />
      {children}
    </>
  );
}
