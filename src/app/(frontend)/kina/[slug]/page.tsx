import { notFound, permanentRedirect } from "next/navigation";
import { getCinemaBySlug } from "@/lib/cinemas";
import { getScreenings } from "@/lib/screenings";
import { ApiNotFoundError } from "@/lib/client";
import SectionDivider from "@/components/ui/section-divider";
import CinemaMapLazy from "./_components/cinema-map-lazy";
import CinemaScreenings from "./_components/cinema-screenings";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import { ICinema } from "@/interfaces/ICinema";
import { IScreeningGroup } from "@/interfaces/IScreenings";
import SectionHeader from "@/components/common/section-header";

export const revalidate = 300;

type CinemaPageProps = {
  params: Promise<{ slug: string }>;
};

const CinemaPage = async ({ params }: CinemaPageProps) => {
  const { slug } = await params;

  let cinema: ICinema;
  let screenings: IScreeningGroup[];

  try {
    cinema = await getCinemaBySlug(slug);

    if (cinema.slug !== slug) {
      permanentRedirect(`/kina/${cinema.slug}`);
    }

    const cityScreenings = await getScreenings({
      cityId: cinema.city.id.toString(),
    });

    screenings = cityScreenings
      .map((group) => ({
        ...group,
        screenings: group.screenings.filter((s) => s.cinema.id === cinema.id),
      }))
      .filter((group) => group.screenings.length > 0);
  } catch (error) {
    if (error instanceof ApiNotFoundError) {
      notFound();
    }
    throw error;
  }

  return (
    <main className="bg-black min-h-screen px-8 py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-16">
          <Breadcrumbs
            items={[{ name: "Kina", href: "/kina" }, { name: cinema.name }]}
          />
          <SectionHeader
            prefix="Kino"
            title={cinema.name}
            description={cinema?.description ?? undefined}
          />
          <SectionDivider />

          <section className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl md:text-3xl font-semibold uppercase text-white tracking-wide">
                Lokalizacja kina
              </h2>

              <address className="text-white/80 max-w-4xl">
                {cinema.street
                  ? `${cinema.name}, ${cinema.street}, ${cinema.city.name}.`
                  : `${cinema.name}, ${cinema.city.name}.`}
              </address>
            </div>

            <CinemaMapLazy cinema={cinema} />
          </section>

          <SectionDivider />
          <CinemaScreenings screenings={screenings} />
        </div>
    </main>
  );
};

export default CinemaPage;
