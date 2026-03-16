import { Metadata } from "next";
import { getCityBySlug } from "@/lib/cities";
import { getCinemas } from "@/lib/cinemas";
import { SITE_URL } from "@/lib/site-config";
import { ICity } from "@/interfaces/ICities";
import JsonLd from "@/components/common/json-ld";

type CityLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

type CityPageParams = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const hasQueryParams = (
  params: Record<string, string | string[] | undefined> | null | undefined
) =>
  params != null &&
  Object.values(params).some((value) =>
    Array.isArray(value)
      ? value.some((item) => item.trim().length > 0)
      : typeof value === "string" && value.trim().length > 0
  );

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

export const generateMetadata = async ({
  params,
  searchParams,
}: CityPageParams): Promise<Metadata> => {
  const { slug } = await params;
  const queryParams = searchParams ? await searchParams : {};
  const { city } = await getCityBySlug(slug);

  const title = `Kina studyjne ${city.name} - repertuar seansów specjalnych`;
  const description = `Kina studyjne i niezależne w ${city.nameDeclinated}. Aktualne seanse specjalne, klasyka filmowa i retrospektywy. Sprawdź repertuar kin w ${city.nameDeclinated}.`;
  const url = `${SITE_URL}/miasta/${city.slug}`;
  const image = `${SITE_URL}/klaps-og.png`;

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
      canonical: url,
    },
    ...(hasQueryParams(queryParams) && {
      robots: {
        index: false,
        follow: true,
      },
    }),
    openGraph: {
      title,
      description,
      url,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${city.name} - kina studyjne i repertuar`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
};

export default async function CityLayout({
  children,
  params,
}: Readonly<CityLayoutProps>) {
  const { slug } = await params;
  const { city, screenings: rawScreenings } = await getCityBySlug(slug);

  const cinemasResponse = await getCinemas({
    cityId: city.id.toString(),
  });

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
      <JsonLd data={buildCityJsonLd(city, cinemasCount, screeningsCount)} />
      {children}
    </>
  );
}
