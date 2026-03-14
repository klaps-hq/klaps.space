import { Metadata } from "next";
import JsonLd from "@/components/common/json-ld";
import { SITE_URL } from "@/lib/site-config";
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
