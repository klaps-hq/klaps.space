import { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { getScreeningById } from "@/lib/screenings";
import { ApiNotFoundError } from "@/lib/client";
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
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const hasQueryParams = (params: Record<string, string | string[] | undefined>) =>
  Object.values(params).some((value) =>
    Array.isArray(value)
      ? value.some((item) => item.trim().length > 0)
      : typeof value === "string" && value.trim().length > 0
  );

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

export const generateMetadata = async ({
  params,
  searchParams,
}: ScreeningPageProps): Promise<Metadata> => {
  const { id } = await params;
  const queryParams = searchParams ? await searchParams : {};
  const { movie, screening } = await getScreeningById(Number(id));

  const dateFormatted = new Date(screening.dateTime).toLocaleDateString(
    "pl-PL",
    { day: "numeric", month: "long", year: "numeric" }
  );

  const title = `${movie.title} - seans w ${screening.cinema.name}, ${screening.cinema.city.name}`;
  const description = movie.description
    ? `${movie.description.slice(0, 100)} Seans ${dateFormatted} w ${screening.cinema.name}, ${screening.cinema.city.name}.`
    : `${movie.title} (${movie.productionYear}) - seans specjalny ${dateFormatted} w ${screening.cinema.name}, ${screening.cinema.city.name}.`;

  return {
    title,
    description,
    keywords: [
      movie.title,
      `${movie.title} seans`,
      screening.cinema.name,
      `seans specjalny ${screening.cinema.city.name}`,
    ],
    alternates: {
      canonical: `${SITE_URL}/seanse/${screening.id}`,
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
      ...(movie.posterUrl && {
        images: [{ url: movie.posterUrl, alt: movie.title }],
      }),
    },
  };
};

export default ScreeningPage;
