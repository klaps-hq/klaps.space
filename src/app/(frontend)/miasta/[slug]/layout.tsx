import { getCityBySlug } from "@/lib/cities";
import { getCinemas } from "@/lib/cinemas";
import { getScreeningsLastUpdated } from "@/lib/screenings";
import { SITE_URL } from "@/lib/site-config";
import { ICity } from "@/interfaces/ICities";
import { IScreeningGroup } from "@/interfaces/IScreenings";
import JsonLd from "@/components/common/json-ld";

type CityLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

const buildCityJsonLd = (
  city: ICity,
  cinemasCount: number,
  screeningsCount: number,
  screeningGroups: IScreeningGroup[],
  lastUpdated: Date | null
) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: `Kina i seanse w ${city.nameDeclinated}`,
  url: `${SITE_URL}/miasta/${city.slug}`,
  description: `${cinemasCount} kin i ${screeningsCount} seansów specjalnych w ${city.nameDeclinated}.`,
  // Freshness signal for AI Overviews: newest screening `updatedAt` for this
  // city (mirrors the visible "Repertuar zaktualizowano" note), i.e. a real
  // data change rather than render time. Omitted when the date is unknown.
  ...(lastUpdated && { dateModified: lastUpdated.toISOString() }),
  // The visible repertoire mirrored as an ItemList, so AI search gets
  // a machine-readable "what's playing in this city" list.
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: screeningGroups.length,
    itemListElement: screeningGroups.map((group, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}/filmy/${group.movie.slug}`,
      name: `${group.movie.title} (${group.movie.productionYear})`,
    })),
  },
});

export default async function CityLayout({
  children,
  params,
}: Readonly<CityLayoutProps>) {
  const { slug } = await params;
  const { city, screenings: rawScreenings } = await getCityBySlug(slug);

  const [cinemasResponse, lastUpdated] = await Promise.all([
    getCinemas({ cityId: city.id.toString() }),
    getScreeningsLastUpdated({ cityId: city.id.toString() }),
  ]);

  const screenings = Array.isArray(rawScreenings)
    ? rawScreenings
    : [...(rawScreenings?.data ?? [])];

  const cinemasCount = cinemasResponse.data.flatMap((g) => g.cinemas).length;
  const screeningsCount = screenings.reduce(
    (sum, group) => sum + group.screenings.length,
    0
  );

  return (
    <>
      <JsonLd
        data={buildCityJsonLd(
          city,
          cinemasCount,
          screeningsCount,
          screenings,
          lastUpdated
        )}
      />
      {children}
    </>
  );
}
