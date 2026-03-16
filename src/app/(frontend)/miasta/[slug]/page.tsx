import { getCityPageData } from "@/lib/cities";
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
  const { city, cinemaGroups, screenings } = await getCityPageData(slug);

  const cinemasCount = cinemaGroups.flatMap((g) => g.cinemas).length;
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
        <CityCinemas cinemaGroups={cinemaGroups} />
        <SectionDivider />
        <CityScreenings screenings={screenings} />
      </div>
    </main>
  );
};

export default CityPage;
