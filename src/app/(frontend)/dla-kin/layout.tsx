import { Metadata } from "next";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Dla kin - odznaka klaps.space na stronę kina",
  description:
    "Wasze kino jest na Klapsie. Wygeneruj darmową odznakę z linkiem do repertuaru seansów specjalnych Waszego kina i wklej ją na swoją stronę.",
  alternates: {
    canonical: `${SITE_URL}/dla-kin`,
  },
  openGraph: {
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
