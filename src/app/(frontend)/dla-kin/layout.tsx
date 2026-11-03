import { Metadata } from "next";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Dla kin - odznaka klaps.space na stronę kina",
  description:
    "Wasze kino jest na Klapsie. Wygenerujcie darmową odznakę z linkiem do repertuaru seansów specjalnych Waszego kina i wklejcie ją na swoją stronę.",
  alternates: {
    canonical: `${SITE_URL}/dla-kin`,
  },
  openGraph: {
    locale: "pl_PL",
    title: "Dla kin - odznaka klaps.space",
    description:
      "Darmowa odznaka z linkiem do repertuaru seansów specjalnych Waszego kina na klaps.space.",
  },
};

export default function ForCinemasLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
