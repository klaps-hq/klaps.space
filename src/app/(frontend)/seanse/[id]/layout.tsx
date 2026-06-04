import { getScreeningById } from "@/lib/screenings";
import { tmdbImageUrl } from "@/lib/tmdb";
import { SITE_URL } from "@/lib/site-config";
import { IScreeningDetail } from "@/interfaces/IScreenings";
import JsonLd from "@/components/common/json-ld";

type ScreeningLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
};

const buildScreeningJsonLd = ({ movie, screening }: IScreeningDetail) => {
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "ScreeningEvent",
    name: `${movie.title} - Seans`,
    startDate: screening.dateTime,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    url: `${SITE_URL}/seanse/${screening.id}`,
    location: {
      "@type": "MovieTheater",
      name: screening.cinema.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: screening.cinema.street ?? undefined,
        addressLocality: screening.cinema.city.name,
        addressCountry: "PL",
      },
    },
    workPresented: {
      "@type": "Movie",
      name: movie.title,
      url: `${SITE_URL}/filmy/${movie.slug}`,
      ...(movie.description && { description: movie.description }),
      ...(movie.posterUrl && { image: tmdbImageUrl(movie.posterUrl, "w780") }),
    },
  };

  if (movie.duration) {
    const startTime = new Date(screening.dateTime).getTime();
    if (!Number.isNaN(startTime)) {
      jsonLd.endDate = new Date(
        startTime + movie.duration * 60 * 1000
      ).toISOString();
    }
  }

  if (screening.ticketUrl) {
    jsonLd.offers = {
      "@type": "Offer",
      url: screening.ticketUrl,
      availability: "https://schema.org/InStock",
    };
  }

  return jsonLd;
};

export default async function ScreeningLayout({
  children,
  params,
}: Readonly<ScreeningLayoutProps>) {
  const { id } = await params;
  const screeningDetail = await getScreeningById(Number(id));

  return (
    <>
      <JsonLd data={buildScreeningJsonLd(screeningDetail)} />
      {children}
    </>
  );
}
