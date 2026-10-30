import { getCityBySlug } from "@/lib/cities";
import { fetchCinemas } from "@/lib/cinemas";
import { getScreenings, getScreeningsLastUpdated } from "@/lib/screenings";
import { SITE_URL } from "@/lib/site-config";
import { inPlace, pluralPl } from "@/lib/seo";
import { ICity } from "@/interfaces/ICities";
import { IScreeningGroup } from "@/interfaces/IScreenings";
import JsonLd from "@/components/common/json-ld";

type CityLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

const buildCityJsonLd = (
  city: ICity,
  cinemasCount: number | null,
  screeningsCount: number,
  screeningGroups: IScreeningGroup[],
  lastUpdated: Date | null
) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: `Kina i seanse ${inPlace(city.nameDeclinated ?? city.name)}`,
  url: `${SITE_URL}/miasta/${city.slug}`,
  description: `${cinemasCount !== null ? `${cinemasCount} ${pluralPl(cinemasCount, "kino", "kina", "kin")} i ` : ""}${screeningsCount} ${pluralPl(screeningsCount, "nadchodzący seans", "nadchodzące seanse", "nadchodzących seansów")} ${inPlace(city.nameDeclinated ?? city.name)}.`,
  // Freshness signal for AI Overviews: newest screening `updatedAt` for this
  // city (mirrors the visible "Repertuar zaktualizowano" note), i.e. a real
  // data change rather than render time. Omitted when the date is unknown.
  ...(lastUpdated && { dateModified: lastUpdated.toISOString() }),
  // The visible repertoire mirrored as an ItemList, so AI search gets
  // a machine-readable "what's playing in this city" list.
  // Omitted when nothing is upcoming: an empty list says nothing.
  ...(screeningGroups.length > 0 && {
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
  }),
});

export default async function CityLayout({
  children,
  params,
}: Readonly<CityLayoutProps>) {
  const { slug } = await params;
  const { city } = await getCityBySlug(slug);

  // Same calls as the page body (deduped by the fetch cache), so the
  // structured data counts what the visitor sees. The raw city payload
  // still held already-started showtimes, and a swallowed cinemas error
  // read as "0 kin" (content audit #4).
  const [cinemasResponse, screenings, lastUpdated] = await Promise.all([
    fetchCinemas({ cityId: city.id.toString() }).catch(() => null),
    getScreenings({ cityId: city.id.toString() }),
    getScreeningsLastUpdated({ cityId: city.id.toString() }),
  ]);

  const cinemasCount =
    cinemasResponse?.data.flatMap((g) => g.cinemas).length ?? null;
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
