import { notFound, permanentRedirect } from "next/navigation";
import { getCityBySlug } from "@/lib/cities";
import { getCinemas } from "@/lib/cinemas";
import { ApiNotFoundError } from "@/lib/client";
import SectionDivider from "@/components/ui/section-divider";
import CityStats from "./_components/city-stats";
import CityCinemas from "./_components/city-cinemas";
import CityScreenings from "./_components/city-screenings";
import SectionHeader from "@/components/common/section-header";
import Breadcrumbs from "@/components/ui/breadcrumbs";

export const revalidate = 300;

type CityPageProps = {
  params: Promise<{ slug: string }>;
};

const CityPage = async ({ params }: CityPageProps) => {
  const { slug } = await params;

  let cityData;
  let cinemasResponse;

  try {
    cityData = await getCityBySlug(slug);

    if (cityData.city.slug !== slug) {
      permanentRedirect(`/miasta/${cityData.city.slug}`);
    }

    cinemasResponse = await getCinemas({
      cityId: cityData.city.id.toString(),
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
    <main className="bg-black min-h-screen px-8 py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-16">
          <Breadcrumbs
            items={[{ name: "Miasta", href: "/miasta" }, { name: city.name }]}
          />
          <SectionHeader
            prefix="Miasto"
            title={city.name}
            description={city?.description ?? undefined}
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
  );
};

export default CityPage;
