import { Suspense } from "react";
import { getCinemaPageData } from "@/lib/cinemas";
import { getGenres } from "@/lib/genres";
import SectionDivider from "@/components/ui/section-divider";
import CinemaMapLazy from "./_components/cinema-map-lazy";
import CinemaScreenings from "./_components/cinema-screenings";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import SectionHeader from "@/components/common/section-header";
import SectionLoader from "@/components/ui/section-loader";

export const dynamic = "force-dynamic";

type SearchParams = {
  genre?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
};

type CinemaPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
};

const CinemaPageContent = async ({
  slug,
  searchParams,
}: {
  slug: string;
  searchParams: SearchParams;
}) => {
  const [{ cinema, screenings }, genres] = await Promise.all([
    getCinemaPageData(slug, {
      genreId: searchParams.genre,
      dateFrom: searchParams.dateFrom,
      dateTo: searchParams.dateTo,
      search: searchParams.search,
    }),
    getGenres(),
  ]);

  return (
    <>
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
      <CinemaScreenings screenings={screenings} genres={genres} />
    </>
  );
};

const CinemaPage = async ({ params, searchParams }: CinemaPageProps) => {
  const { slug } = await params;
  const sp = await searchParams;

  return (
    <main className="bg-black min-h-screen px-8 py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-16">
        <Suspense fallback={<SectionLoader label="Ladowanie kina" />}>
          <CinemaPageContent slug={slug} searchParams={sp} />
        </Suspense>
      </div>
    </main>
  );
};

export default CinemaPage;
