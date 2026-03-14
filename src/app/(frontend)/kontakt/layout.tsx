import { Metadata } from "next";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Skontaktuj się z zespołem Klaps. Współpraca z kinami studyjnymi, zgłoszenia błędów, propozycje nowych kin i funkcji serwisu.",
  alternates: {
    canonical: `${SITE_URL}/kontakt`,
  },
  openGraph: {
    title: "Kontakt - Klaps",
    description:
      "Skontaktuj się z zespołem Klaps. Współpraca z kinami studyjnymi, zgłoszenia i propozycje.",
  },
};

export default function ContactLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
