import { getCinemaBySlug } from "@/lib/cinemas";
import { getScreenings } from "@/lib/screenings";
import { SITE_URL } from "@/lib/site-config";
import { buildScreeningEventsJsonLd } from "@/lib/screening-event-jsonld";
import { ICinema } from "@/interfaces/ICinema";
import { IScreeningGroup } from "@/interfaces/IScreenings";
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

// Events anchored at the cinema page: one per upcoming screening across
// the whole repertoire, with the cinema (and its geo) as the location.
const buildCinemaScreeningEvents = (
  cinema: ICinema,
  groups: IScreeningGroup[]
) =>
  buildScreeningEventsJsonLd(
    groups.flatMap((group) =>
      group.screenings.map((screening) => ({
        movie: {
          title: group.movie.title,
          slug: group.movie.slug,
          duration: group.movie.duration,
        },
        cinema: {
          name: cinema.name,
          slug: cinema.slug,
          street: cinema.street,
          cityName: cinema.city.name,
          latitude: cinema.latitude,
          longitude: cinema.longitude,
        },
        dateTime: screening.dateTime,
        ticketUrl: screening.ticketUrl,
      }))
    ),
    `${SITE_URL}/kina/${cinema.slug}`
  );

export default async function CinemaLayout({
  children,
  params,
}: Readonly<CinemaLayoutProps>) {
  const { slug } = await params;
  const cinema = await getCinemaBySlug(slug);

  // Same call as the page body: deduped by the fetch cache. Falls back
  // to [] internally, so a screenings hiccup never breaks the layout.
  const screeningGroups = await getScreenings({
    cinemaId: cinema.id.toString(),
  });

  const events = buildCinemaScreeningEvents(cinema, screeningGroups);

  return (
    <>
      <JsonLd data={buildCinemaJsonLd(cinema)} />
      {events.length > 0 && <JsonLd data={events} />}
      {children}
    </>
  );
}
