import SectionHeader from "@/components/common/section-header";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import CitiesList from "./_components/cities-list";
import { getCities } from "@/lib/cities";

export const revalidate = 300;

const CitiesPage = async () => {
  const cities = await getCities();

  return (
    <main className="bg-black min-h-screen px-8 py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-16">
        <div className="flex flex-col gap-6">
          <Breadcrumbs items={[{ name: "Miasta", href: "/miasta" }]} />
          <SectionHeader
            prefix="Miasta"
            title="Miasta z kinami"
            description="Wybierz miasto i sprawdź, jakie seanse czekają na Ciebie w Twoim regionie."
          />
        </div>

        <CitiesList cities={cities} />
      </div>
    </main>
  );
};

export default CitiesPage;
