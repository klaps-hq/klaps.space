import { Metadata } from "next";
import { Suspense } from "react";
import ScreeningsSection from "./_components/screenings-section";
import ScreeningsSectionLoader from "./_components/screenings-section/screenings-section-loader";
import JsonLd from "@/components/common/json-ld";
import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
} from "@/lib/site-config";

type SearchParams = {
  city?: string;
  genre?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
};

interface HomeProps {
  searchParams: Promise<SearchParams>;
}

const HomePage = async ({ searchParams }: HomeProps) => {
  const params = await searchParams;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          url: SITE_URL,
          description: SITE_DESCRIPTION,
        }}
      />
      <Suspense fallback={<ScreeningsSectionLoader />}>
        <ScreeningsSection searchParams={params} />
      </Suspense>
    </>
  );
};

export const metadata: Metadata = {
  title: {
    absolute: "Klaps - Repertuar seansów specjalnych i klasyki filmowej",
  },
  description:
    "Ogólnopolski przewodnik po seansach specjalnych, klasyce i retrospektywach w kinach studyjnych. Sprawdź co grają.",
  alternates: {
    canonical: SITE_URL,
  },
};

export default HomePage;
