import { Metadata } from "next";
import { getCinemaBySlug } from "@/lib/cinemas";
import { SITE_URL } from "@/lib/site-config";
import { ICinema } from "@/interfaces/ICinema";
import JsonLd from "@/components/common/json-ld";

type CinemaLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

type CinemaPageParams = {
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

const buildCinemaJsonLd = (cinema: ICinema) => {
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "MovieTheater",
    name: cinema.name,
    url: `${SITE_URL}/kina/${cinema.slug}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: cinema.street ?? undefined,
      addressLocality: cinema.city.name,
      addressCountry: "PL",
    },
  };

  if (cinema.latitude && cinema.longitude) {
    jsonLd.geo = {
      "@type": "GeoCoordinates",
      latitude: cinema.latitude,
      longitude: cinema.longitude,
    };
  }

  if (cinema.sourceUrl) {
    jsonLd.sameAs = cinema.sourceUrl;
  }

  return jsonLd;
};

export const generateMetadata = async ({
  params,
  searchParams,
}: CinemaPageParams): Promise<Metadata> => {
  const { slug } = await params;
  const queryParams = searchParams ? await searchParams : {};
  const cinema = await getCinemaBySlug(slug);

  const title = `${cinema.name} - kino studyjne ${cinema.city.name}`;
  const description = `${cinema.name} - kino studyjne w ${cinema.city.name}. Repertuar seansów specjalnych, klasyki filmowej i retrospektyw. Sprawdź co grają.`;
  const url = `${SITE_URL}/kina/${cinema.slug}`;
  const image = `${SITE_URL}/klaps-og.png`;

  return {
    title,
    description,
    keywords: [
      cinema.name,
      `kino studyjne ${cinema.city.name}`,
      `repertuar ${cinema.name}`,
      `seanse specjalne ${cinema.city.name}`,
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
          alt: `${cinema.name} - kino studyjne w ${cinema.city.name}`,
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

export default async function CinemaLayout({
  children,
  params,
}: Readonly<CinemaLayoutProps>) {
  const { slug } = await params;
  const cinema = await getCinemaBySlug(slug);

  return (
    <>
      <JsonLd data={buildCinemaJsonLd(cinema)} />
      {children}
    </>
  );
}
