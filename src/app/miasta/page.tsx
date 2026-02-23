import { Metadata } from "next";
import { getCinemas } from "@/lib/cinemas";
import { SITE_URL } from "@/lib/site-config";
import SectionHeader from "@/components/common/section-header";
import CitiesList from "./_components/cities-list";

export const dynamic = "force-dynamic";

const CitiesPage = async () => {
  const { data: cinemaGroups } = await getCinemas({ limit: 500 });

  return (
    <main className="bg-black min-h-screen px-8 py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-16">
        <SectionHeader
          prefix="Miasta"
          title="Miasta z kinami"
          description="Wybierz miasto i sprawdź, jakie seanse czekają na Ciebie w Twoim regionie."
        />

        <CitiesList cinemaGroups={cinemaGroups} />
      </div>
    </main>
  );
};

export const metadata: Metadata = {
  title: "Miasta",
  description:
    "Lista miast z kinami w Polsce. Znajdź kino niezależne w swoim mieście i sprawdź aktualne seanse.",
  alternates: {
    canonical: `${SITE_URL}/miasta`,
  },
};

export default CitiesPage;
