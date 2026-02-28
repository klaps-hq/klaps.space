import { Metadata } from "next";
import { SITE_URL } from "@/lib/site-config";
import SectionHeader from "@/components/common/section-header";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import CitiesList from "./_components/cities-list";
import { getCities } from "@/lib/cities";

export const revalidate = 300;

const CitiesPage = async () => {
  const cities = await getCities();

  console.log(cities);

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

export const metadata: Metadata = {
  title: "Kina studyjne w miastach Polski",
  description:
    "Wybierz miasto i sprawdź kina studyjne w swoim regionie. Repertuar seansów specjalnych, klasyki filmowej i retrospektyw w miastach w całej Polsce.",
  keywords: [
    "kina studyjne w miastach",
    "kino studyjne Warszawa",
    "kino studyjne Kraków",
    "kino studyjne Wrocław",
    "kina niezależne miasta",
  ],
  alternates: {
    canonical: `${SITE_URL}/miasta`,
  },
  openGraph: {
    title: "Kina studyjne w miastach Polski",
    description:
      "Wybierz miasto i sprawdź kina studyjne w swoim regionie. Repertuar seansów specjalnych, klasyki filmowej i retrospektyw w miastach w całej Polsce.",
    url: `${SITE_URL}/miasta`,
    images: [
      {
        url: `${SITE_URL}/klaps-og.png`,
        width: 1200,
        height: 630,
        alt: "Kina studyjne w miastach Polski",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kina studyjne w miastach Polski",
    description:
      "Wybierz miasto i sprawdź kina studyjne w swoim regionie. Repertuar seansów specjalnych, klasyki filmowej i retrospektyw w miastach w całej Polsce.",
    images: [`${SITE_URL}/klaps-og.png`],
  },
};

export default CitiesPage;
