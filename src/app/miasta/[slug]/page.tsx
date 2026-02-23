import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCityBySlug } from "@/lib/cities";
import { getCinemas } from "@/lib/cinemas";
import { ApiNotFoundError } from "@/lib/client";
import SectionDivider from "@/components/ui/section-divider";
import CityStats from "./_components/city-stats";
import CityCinemas from "./_components/city-cinemas";
import CityScreenings from "./_components/city-screenings";
import SectionHeader from "@/components/common/section-header";
import JsonLd from "@/components/common/json-ld";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import { SITE_URL } from "@/lib/site-config";
import { ICity } from "@/interfaces/ICities";

export const revalidate = 300;

type CityPageProps = {
  params: Promise<{ slug: string }>;
};

const buildCityJsonLd = (
  city: ICity,
  cinemasCount: number,
  screeningsCount: number
) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: `Kina i seanse w ${city.nameDeclinated}`,
  url: `${SITE_URL}/miasta/${city.slug}`,
  description: `${cinemasCount} kin i ${screeningsCount} seansów specjalnych w ${city.nameDeclinated}.`,
});

const CityPage = async ({ params }: CityPageProps) => {
  const { slug } = await params;

  let cityData;
  let cinemasResponse;

  try {
    cityData = await getCityBySlug(slug);
    cinemasResponse = await getCinemas({
      cityId: cityData.city.id.toString(),
      limit: 100,
    });
  } catch (error) {
    if (error instanceof ApiNotFoundError) {
      notFound();
    }
    throw error;
  }

  const { screenings: rawScreenings, city } = cityData;

  const screenings = Array.isArray(rawScreenings)
    ? rawScreenings
    : [...(rawScreenings?.data ?? [])];

  const cinemasCount = cinemasResponse.data.flatMap((g) => g.cinemas).length;
  const moviesCount = screenings.length;
  const screeningsCount = screenings.reduce(
    (sum, group) => sum + group.screenings.length,
    0
  );

  return (
    <>
      <JsonLd data={buildCityJsonLd(city, cinemasCount, screeningsCount)} />
      <main className="bg-black min-h-screen px-8 py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-16">
          <Breadcrumbs
            items={[
              { name: "Miasta", href: "/miasta" },
              { name: city.name },
            ]}
          />
          <SectionHeader
            prefix="Miasto"
            title={city.name}
            description={`Kina i aktualne seanse w ${city.nameDeclinated}.`}
          />

          <CityStats
            cinemasCount={cinemasCount}
            moviesCount={moviesCount}
            screeningsCount={screeningsCount}
          />

          <SectionDivider />
          <CityCinemas cinemaGroups={cinemasResponse.data} />
          <SectionDivider />
          <CityScreenings screenings={screenings} />
        </div>
      </main>
    </>
  );
};

export const generateMetadata = async ({
  params,
}: CityPageProps): Promise<Metadata> => {
  const { slug } = await params;
  const { city } = await getCityBySlug(slug);

  const title = `Kina studyjne ${city.name} - repertuar seansów specjalnych`;
  const description = `Kina studyjne i niezależne w ${city.nameDeclinated}. Aktualne seanse specjalne, klasyka filmowa i retrospektywy. Sprawdź repertuar kin w ${city.nameDeclinated}.`;

  return {
    title,
    description,
    keywords: [
      `kino studyjne ${city.name}`,
      `kina ${city.name}`,
      `seanse specjalne ${city.name}`,
      `repertuar kin ${city.name}`,
      `kino niezależne ${city.name}`,
    ],
    alternates: {
      canonical: `${SITE_URL}/miasta/${slug}`,
    },
    openGraph: {
      title,
      description,
    },
  };
};

export default CityPage;
