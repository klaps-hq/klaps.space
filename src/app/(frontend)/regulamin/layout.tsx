import { Metadata } from "next";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Regulamin",
  description:
    "Regulamin korzystania z serwisu Klaps. Zasady, odpowiedzialność, prawa autorskie i dane kontaktowe.",
  alternates: {
    canonical: `${SITE_URL}/regulamin`,
  },
};

export default function TermsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
