import { Metadata } from "next";
import JsonLd from "@/components/common/json-ld";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site-config";
import { BASE_OPEN_GRAPH } from "@/lib/seo";

export const metadata: Metadata = {
  title: {
    absolute: "Klaps - Stare filmy i seanse specjalne w kinach studyjnych",
  },
  description:
    "Ogólnopolski przewodnik po seansach specjalnych, klasyce filmowej i starych filmach w kinach studyjnych w Polsce. Repertuar, filmy i kina w jednym miejscu.",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    ...BASE_OPEN_GRAPH,
    type: "website",
    url: SITE_URL,
    title: "Klaps - Stare filmy i seanse specjalne w kinach studyjnych",
    description:
      "Ogólnopolski przewodnik po seansach specjalnych, klasyce filmowej i starych filmach w kinach studyjnych. Sprawdź, co grają.",
  },
};

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          url: SITE_URL,
          description: SITE_DESCRIPTION,
          inLanguage: "pl-PL",
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${SITE_URL}/seanse?search={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
          },
        }}
      />
      {children}
    </>
  );
}
