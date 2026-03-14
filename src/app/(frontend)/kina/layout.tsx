import { Metadata } from "next";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Kina studyjne w Polsce",
  description:
    "Pełna lista kin studyjnych i niezależnych w Polsce. Znajdź kino artystyczne w swoim mieście i sprawdź aktualny repertuar seansów specjalnych.",
  keywords: [
    "kina studyjne w Polsce",
    "kina niezależne",
    "kino artystyczne",
    "lista kin studyjnych",
    "kino studyjne w moim mieście",
  ],
  alternates: {
    canonical: `${SITE_URL}/kina`,
  },
  openGraph: {
    title: "Kina studyjne w Polsce",
    description:
      "Pełna lista kin studyjnych i niezależnych w Polsce. Znajdź kino artystyczne w swoim mieście i sprawdź aktualny repertuar seansów specjalnych.",
    url: `${SITE_URL}/kina`,
    images: [
      {
        url: `${SITE_URL}/klaps-og.png`,
        width: 1200,
        height: 630,
        alt: "Kina studyjne w Polsce",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kina studyjne w Polsce",
    description:
      "Pełna lista kin studyjnych i niezależnych w Polsce. Znajdź kino artystyczne w swoim mieście i sprawdź aktualny repertuar seansów specjalnych.",
    images: [`${SITE_URL}/klaps-og.png`],
  },
};

export default function CinemasLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
