import { notFound, permanentRedirect } from "next/navigation";
import { getScreeningById } from "@/lib/screenings";
import { ApiNotFoundError } from "@/lib/client";
import { tmdbImageUrl } from "@/lib/tmdb";
import SectionDivider from "@/components/ui/section-divider";
import ScreeningHero from "./_components/screening-hero";
import ScreeningInfo from "./_components/screening-info";
import ScreeningCinema from "./_components/screening-cinema";
import ScreeningTicketButton from "./_components/screening-ticket-button";
import JsonLd from "@/components/common/json-ld";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import { SITE_URL } from "@/lib/site-config";
import { IScreeningDetail } from "@/interfaces/IScreenings";

export const revalidate = 300;

type ScreeningPageProps = {
  params: Promise<{ id: string }>;
};

const buildScreeningJsonLd = ({ movie, screening }: IScreeningDetail) => {
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "ScreeningEvent",
    name: `${movie.title} - Seans`,
    startDate: screening.dateTime,
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

  if (screening.ticketUrl) {
    jsonLd.offers = {
      "@type": "Offer",
      url: screening.ticketUrl,
      availability: "https://schema.org/InStock",
    };
  }

  return jsonLd;
};

const ScreeningPage = async ({ params }: ScreeningPageProps) => {
  const { id } = await params;

  let movie;
  let screening;

  try {
    ({ movie, screening } = await getScreeningById(Number(id)));
    if (id !== screening.id.toString()) {
      permanentRedirect(`/seanse/${screening.id}`);
    }
  } catch (error) {
    if (error instanceof ApiNotFoundError) {
      notFound();
    }
    throw error;
  }

  return (
    <>
      <JsonLd data={buildScreeningJsonLd({ movie, screening })} />
      <main className="bg-black min-h-screen px-8 py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-16">
          <Breadcrumbs
            items={[
              { name: "Seanse", href: "/seanse" },
              { name: `${movie.title} - Seans` },
            ]}
          />
          <ScreeningHero movie={movie} />

          <SectionDivider />
          <ScreeningInfo screening={screening} />

          <SectionDivider />
          <ScreeningCinema cinema={screening.cinema} />

          {screening.ticketUrl && (
            <>
              <SectionDivider />
              <ScreeningTicketButton ticketUrl={screening.ticketUrl} />
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default ScreeningPage;
