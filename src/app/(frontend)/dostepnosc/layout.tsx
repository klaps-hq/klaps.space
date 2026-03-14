import { Metadata } from "next";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Dostępność",
  description:
    "Deklaracja dostępności serwisu Klaps. Informacje o zgodności ze standardami, obsługiwanych technologiach i sposobach kontaktu.",
  alternates: {
    canonical: `${SITE_URL}/dostepnosc`,
  },
};

export default function AccessibilityLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
