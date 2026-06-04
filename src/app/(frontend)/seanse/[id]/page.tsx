import { Metadata } from "next";
import { getScreeningPageData, getScreeningById } from "@/lib/screenings";
import { tmdbImageUrl } from "@/lib/tmdb";
import { SITE_URL } from "@/lib/site-config";
import { BASE_OPEN_GRAPH } from "@/lib/seo";
import SectionDivider from "@/components/ui/section-divider";
import ScreeningHero from "./_components/screening-hero";
import ScreeningInfo from "./_components/screening-info";
import ScreeningCinema from "./_components/screening-cinema";
import ScreeningTicketButton from "./_components/screening-ticket-button";
import Breadcrumbs from "@/components/ui/breadcrumbs";

export const revalidate = 300;

type ScreeningPageProps = {
  params: Promise<{ id: string }>;
};

export const generateMetadata = async ({
  params,
}: ScreeningPageProps): Promise<Metadata> => {
  const { id } = await params;
  const { movie, screening } = await getScreeningById(Number(id));

  const dateFormatted = new Date(screening.dateTime).toLocaleDateString(
    "pl-PL",
    { day: "numeric", month: "long", year: "numeric" }
  );

  const title = `${movie.title} - seans w ${screening.cinema.name}, ${screening.cinema.city.name}`;
  const description = movie.description
    ? `${movie.description.slice(0, 100)} Seans ${dateFormatted} w ${screening.cinema.name}, ${screening.cinema.city.name}.`
    : `${movie.title} (${movie.productionYear}) - seans specjalny ${dateFormatted} w ${screening.cinema.name}, ${screening.cinema.city.name}.`;
  const url = `${SITE_URL}/seanse/${screening.id}`;

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
      canonical: url,
    },
    openGraph: {
      ...BASE_OPEN_GRAPH,
      type: "website",
      url,
      title,
      description,
      ...(movie.posterUrl && {
        images: [
          { url: tmdbImageUrl(movie.posterUrl, "w780"), alt: movie.title },
        ],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(movie.posterUrl && {
        images: [tmdbImageUrl(movie.posterUrl, "w780")],
      }),
    },
  };
};

const ScreeningPage = async ({ params }: ScreeningPageProps) => {
  const { id } = await params;
  const { movie, screening } = await getScreeningPageData(Number(id));

  return (
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
  );
};

export default ScreeningPage;
