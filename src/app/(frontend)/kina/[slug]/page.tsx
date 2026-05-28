import React, { Suspense } from "react";
import Link from "next/link";
import { getCinemaPageData } from "@/lib/cinemas";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import SiteHeader from "@/components/common/site-header";
import SectionLoader from "@/components/ui/section-loader";
import Footer from "../../(home)/_components/footer";
import ScreeningCard from "../../(home)/_components/screenings/screening-card";
import CinemaMapLazy from "./_components/cinema-map-lazy";

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
  const { cinema, screenings } = await getCinemaPageData(slug, {
    genreId: searchParams.genre,
    dateFrom: searchParams.dateFrom,
    dateTo: searchParams.dateTo,
    search: searchParams.search,
  });

  const hasCoordinates = cinema.latitude !== null && cinema.longitude !== null;
  const cityForCopy = cinema.city.nameDeclinated ?? cinema.city.name;

  return (
    <>
      <div className="px-6 md:px-12 lg:px-16 pt-6 md:pt-8 pb-4">
        <Breadcrumbs
          items={[
            { name: "Kina", href: "/kina" },
            { name: cinema.name },
          ]}
        />
      </div>

      <header className="px-6 md:px-12 lg:px-16 pt-6 md:pt-8 pb-12 md:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-5">
            <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-medium uppercase -tracking-[0.02em] leading-[1] text-white max-w-[20ch]">
              {cinema.name}
            </h1>
            <div className="mt-4 md:mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-[10px] md:text-xs uppercase tracking-[0.22em] text-white/45">
              <span>
                {cinema.street && <>{cinema.street}, </>}
                <Link
                  href={`/miasta/${cinema.city.slug}`}
                  className="text-white/70 hover:text-white transition-colors border-b border-transparent hover:border-white/40 pb-0.5"
                >
                  {cinema.city.name}
                </Link>
              </span>
              {cinema.sourceUrl && (
                <>
                  <span aria-hidden="true">·</span>
                  <Link
                    href={cinema.sourceUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-white/70 hover:text-white transition-colors border-b border-transparent hover:border-white/40 pb-0.5"
                  >
                    Strona kina ↗
                  </Link>
                </>
              )}
            </div>
            {cinema.description && (
              <p className="mt-8 md:mt-10 max-w-[60ch] text-base md:text-lg text-white/65 leading-relaxed">
                {cinema.description}
              </p>
            )}
          </div>

          {hasCoordinates && (
            <div className="lg:col-span-7">
              <CinemaMapLazy cinema={cinema} />
            </div>
          )}
        </div>
      </header>

      <section className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-12 md:pt-16 pb-20 md:pb-28">
        <div className="mb-8 md:mb-10 flex items-end justify-between gap-6 flex-wrap">
          <h2 className="text-2xl md:text-4xl lg:text-5xl leading-[1.05] -tracking-[0.02em] max-w-[26ch]">
            <span className="block text-white font-medium">
              Co gra w&nbsp;{cinema.name}
            </span>
          </h2>
          {screenings.length > 0 && (
            <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/40 tabular-nums">
              {screenings.length}{" "}
              {screenings.length === 1 ? "film" : "filmów"}
            </span>
          )}
        </div>

        {screenings.length === 0 ? (
          <div className="flex flex-col items-start gap-6 py-4">
            <p className="text-base md:text-lg text-white/55 max-w-[48ch]">
              Brak aktualnych seansów w&nbsp;tym kinie. Sprawdź repertuar
              w&nbsp;innych miejscach w&nbsp;{cityForCopy}.
            </p>
            <Link
              href={`/miasta/${cinema.city.slug}`}
              className="group inline-flex items-center gap-3 text-xs md:text-sm uppercase tracking-[0.28em] text-white border border-white/25 hover:border-white hover:bg-white/[0.04] px-7 md:px-9 py-4 md:py-5 transition-colors"
            >
              Inne kina w&nbsp;{cinema.city.name}
              <span
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-x-4 md:gap-x-6 gap-y-10 md:gap-y-12">
            {screenings.map((group) => (
              <ScreeningCard key={group.movie.id} group={group} />
            ))}
          </div>
        )}
      </section>
    </>
  );
};

const CinemaPage = async ({ params, searchParams }: CinemaPageProps) => {
  const { slug } = await params;
  const sp = await searchParams;

  return (
    <main className="bg-black text-white min-h-screen">
      <SiteHeader />
      <Suspense fallback={<SectionLoader label="Ładowanie kina" />}>
        <CinemaPageContent slug={slug} searchParams={sp} />
      </Suspense>
      <Footer />
    </main>
  );
};

export default CinemaPage;
