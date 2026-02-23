import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCinemaBySlug } from "@/lib/cinemas";
import { getScreenings } from "@/lib/screenings";
import { ApiNotFoundError } from "@/lib/client";
import SectionDivider from "@/components/ui/section-divider";
import CinemaHeader from "./_components/cinema-header";
import CinemaMapLazy from "./_components/cinema-map-lazy";
import CinemaScreenings from "./_components/cinema-screenings";
import JsonLd from "@/components/common/json-ld";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import { SITE_URL } from "@/lib/site-config";
import { ICinema } from "@/interfaces/ICinema";
import { IScreeningGroup } from "@/interfaces/IScreenings";

export const revalidate = 300;

type CinemaPageProps = {
  params: Promise<{ slug: string }>;
};

const buildCinemaJsonLd = (cinema: ICinema) => {
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "MovieTheater",
    name: cinema.name,
    url: `${SITE_URL}/kina/${cinema.slug}`,
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
  const { slug } = await params;

  let cinema: ICinema;
  let screenings: IScreeningGroup[];

  try {
    cinema = await getCinemaBySlug(slug);
    const cityScreenings = await getScreenings({
      cityId: cinema.city.id.toString(),
      limit: 1000,
    });
    screenings = cityScreenings
      .map((group) => ({
        ...group,
        screenings: group.screenings.filter((s) => s.cinema.id === cinema.id),
      }))
      .filter((group) => group.screenings.length > 0);
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
          <Breadcrumbs
            items={[
              { name: "Kina", href: "/kina" },
              { name: cinema.name },
            ]}
          />
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
  const { slug } = await params;
  const cinema = await getCinemaBySlug(slug);

  const title = `${cinema.name} - kino studyjne ${cinema.city.name}`;
  const description = `${cinema.name} - kino studyjne w ${cinema.city.name}. Repertuar seansów specjalnych, klasyki filmowej i retrospektyw. Sprawdź co grają.`;

  return {
    title,
    description,
    keywords: [
      cinema.name,
      `kino studyjne ${cinema.city.name}`,
      `repertuar ${cinema.name}`,
      `seanse specjalne ${cinema.city.name}`,
    ],
    alternates: {
      canonical: `${SITE_URL}/kina/${slug}`,
    },
    openGraph: {
      title,
      description,
    },
  };
};

export default CinemaPage;
