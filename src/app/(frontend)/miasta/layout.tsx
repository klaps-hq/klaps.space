import { Metadata } from "next";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Kina studyjne w miastach Polski",
  description:
    "Wybierz miasto i sprawdź kina studyjne w swoim regionie. Repertuar seansów specjalnych, klasyki filmowej i retrospektyw w miastach w całej Polsce.",
  keywords: [
    "kina studyjne w miastach",
    "kino studyjne Warszawa",
    "kino studyjne Kraków",
    "kino studyjne Wrocław",
    "kina niezależne miasta",
  ],
  alternates: {
    canonical: `${SITE_URL}/miasta`,
  },
  openGraph: {
    title: "Kina studyjne w miastach Polski",
    description:
      "Wybierz miasto i sprawdź kina studyjne w swoim regionie. Repertuar seansów specjalnych, klasyki filmowej i retrospektyw w miastach w całej Polsce.",
    url: `${SITE_URL}/miasta`,
    images: [
      {
        url: `${SITE_URL}/klaps-og.png`,
        width: 1200,
        height: 630,
        alt: "Kina studyjne w miastach Polski",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kina studyjne w miastach Polski",
    description:
      "Wybierz miasto i sprawdź kina studyjne w swoim regionie. Repertuar seansów specjalnych, klasyki filmowej i retrospektyw w miastach w całej Polsce.",
    images: [`${SITE_URL}/klaps-og.png`],
  },
};

export default function CitiesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
