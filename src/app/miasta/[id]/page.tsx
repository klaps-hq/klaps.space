import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCityById } from "@/lib/cities";
import { getCinemas } from "@/lib/cinemas";
import { ApiNotFoundError } from "@/lib/client";
import SectionDivider from "@/components/ui/section-divider";
import CityStats from "./_components/city-stats";
import CityCinemas from "./_components/city-cinemas";
import CityScreenings from "./_components/city-screenings";
import SectionHeader from "@/components/common/section-header";
import JsonLd from "@/components/common/json-ld";
import { SITE_URL } from "@/lib/site-config";
import { ICity } from "@/interfaces/ICities";

export const dynamic = "force-dynamic";

type CityPageProps = {
  params: Promise<{ id: string }>;
};

const buildCityJsonLd = (
  city: ICity,
  cinemasCount: number,
  screeningsCount: number
) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: `Kina i seanse w ${city.nameDeclinated}`,
  url: `${SITE_URL}/miasta/${city.id}`,
  description: `${cinemasCount} kin i ${screeningsCount} seansów specjalnych w ${city.nameDeclinated}.`,
});

const CityPage = async ({ params }: CityPageProps) => {
  const { id } = await params;

  let cityData;
  let cinemasResponse;

  try {
    [cityData, cinemasResponse] = await Promise.all([
      getCityById(Number(id)),
      getCinemas({ cityId: id, limit: 100 }),
    ]);
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
  const { id } = await params;
  const { city } = await getCityById(Number(id));

  return {
    title: `Kina studyjne w ${city.nameDeclinated}`,
    description: `Kina studyjne i aktualne seanse w ${city.nameDeclinated}. Sprawdź repertuar kin niezależnych.`,
    alternates: {
      canonical: `${SITE_URL}/miasta/${id}`,
    },
  };
};

export default CityPage;
