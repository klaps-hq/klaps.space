import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCinemaById } from "@/lib/cinemas";
import { getScreenings } from "@/lib/screenings";
import { ApiNotFoundError } from "@/lib/client";
import SectionDivider from "@/components/ui/section-divider";
import CinemaHeader from "./_components/cinema-header";
import CinemaMapLazy from "./_components/cinema-map-lazy";
import CinemaScreenings from "./_components/cinema-screenings";
import JsonLd from "@/components/common/json-ld";
import { SITE_URL } from "@/lib/site-config";
import { ICinema } from "@/interfaces/ICinema";

export const dynamic = "force-dynamic";

type CinemaPageProps = {
  params: Promise<{ id: string }>;
};

const buildCinemaJsonLd = (cinema: ICinema) => {
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "MovieTheater",
    name: cinema.name,
    url: `${SITE_URL}/kina/${cinema.id}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: cinema.street ?? undefined,
      addressLocality: cinema.city.name,
      addressCountry: "PL",
    },
  };

  if (cinema.latitude && cinema.longitude) {
    jsonLd.geo = {
      "@type": "GeoCoordinates",
      latitude: cinema.latitude,
      longitude: cinema.longitude,
    };
  }

  if (cinema.sourceUrl) {
    jsonLd.sameAs = cinema.sourceUrl;
  }

  return jsonLd;
};

const CinemaPage = async ({ params }: CinemaPageProps) => {
  const { id } = await params;

  let cinema;
  let screenings;

  try {
    [cinema, screenings] = await Promise.all([
      getCinemaById(id),
      getScreenings({ cinemaId: id, limit: 100 }),
    ]);
  } catch (error) {
    if (error instanceof ApiNotFoundError) {
      notFound();
    }
    throw error;
  }

  return (
    <>
      <JsonLd data={buildCinemaJsonLd(cinema)} />
      <main className="bg-black min-h-screen px-8 py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-16">
          <CinemaHeader cinema={cinema} />
          <SectionDivider />
          <CinemaMapLazy cinema={cinema} />
          <SectionDivider />
          <CinemaScreenings screenings={screenings} />
        </div>
      </main>
    </>
  );
};

export const generateMetadata = async ({
  params,
}: CinemaPageProps): Promise<Metadata> => {
  const { id } = await params;
  const cinema = await getCinemaById(id);

  return {
    title: cinema.name,
    description: `Kino studyjne ${cinema.name} w ${cinema.city.name}. Sprawdź aktualne seanse.`,
    alternates: {
      canonical: `${SITE_URL}/kina/${id}`,
    },
  };
};

export default CinemaPage;
