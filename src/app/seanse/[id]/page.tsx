import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getScreeningById } from "@/lib/screenings";
import { ApiNotFoundError } from "@/lib/client";
import SectionDivider from "@/components/ui/section-divider";
import ScreeningHero from "./_components/screening-hero";
import ScreeningInfo from "./_components/screening-info";
import ScreeningCinema from "./_components/screening-cinema";
import ScreeningTicketButton from "./_components/screening-ticket-button";
import JsonLd from "@/components/common/json-ld";
import { SITE_URL } from "@/lib/site-config";
import { IScreeningDetail } from "@/interfaces/IScreenings";

export const dynamic = "force-dynamic";

type ScreeningPageProps = {
  params: Promise<{ id: string }>;
};

const buildScreeningJsonLd = ({ movie, screening }: IScreeningDetail) => {
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "ScreeningEvent",
    name: `${movie.title} — Seans`,
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
      url: `${SITE_URL}/filmy/${movie.id}`,
      ...(movie.description && { description: movie.description }),
      ...(movie.posterUrl && { image: movie.posterUrl }),
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

export const generateMetadata = async ({
  params,
}: ScreeningPageProps): Promise<Metadata> => {
  const { id } = await params;
  const { movie, screening } = await getScreeningById(Number(id));

  const description = movie.description
    ? movie.description.slice(0, 160)
    : `${movie.title} (${movie.productionYear}) - seans w ${screening.cinema.name}, ${screening.cinema.city.name}.`;

  return {
    title: `${movie.title} - Seans`,
    description,
    alternates: {
      canonical: `${SITE_URL}/seanse/${id}`,
    },
  };
};

export default ScreeningPage;
