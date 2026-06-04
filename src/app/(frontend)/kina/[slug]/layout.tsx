import { getCinemaBySlug } from "@/lib/cinemas";
import { SITE_URL } from "@/lib/site-config";
import { ICinema } from "@/interfaces/ICinema";
import JsonLd from "@/components/common/json-ld";

type CinemaLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

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
