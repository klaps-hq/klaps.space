import { Metadata } from "next";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Polityka prywatności",
  description:
    "Polityka prywatności serwisu Klaps. Informacje o przetwarzaniu danych, plikach cookies i prawach użytkowników.",
  alternates: {
    canonical: `${SITE_URL}/polityka-prywatnosci`,
  },
};

export default function PrivacyPolicyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
