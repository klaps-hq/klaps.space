import { getCinemas } from "@/lib/cinemas";
import SectionHeader from "@/components/common/section-header";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import CinemasList from "./_components/cinemas-list";

export const revalidate = 300;

const CinemasPage = async () => {
  const { data: cinemaGroups } = await getCinemas({ limit: 1000 });

  const sortedGroups = [...cinemaGroups].sort((a, b) =>
    a.city.name.localeCompare(b.city.name, "pl")
  );

  return (
    <main className="bg-black min-h-screen px-8 py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-16">
        <div className="flex flex-col gap-6">
          <Breadcrumbs items={[{ name: "Kina", href: "/kina" }]} />
          <SectionHeader
            prefix="Lista kin"
            title="Kina studyjne w Polsce"
            description="Miejsca, w których kino jest czymś więcej niż rozrywką."
          />
        </div>

        <CinemasList cinemaGroups={sortedGroups} />
      </div>
    </main>
  );
};

export default CinemasPage;
