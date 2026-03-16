import { getScreeningPageData } from "@/lib/screenings";
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
