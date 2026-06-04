import React, { Suspense } from "react";
import Link from "next/link";
import { Metadata } from "next";
import { getCinemaPageData, getCinemaBySlug } from "@/lib/cinemas";
import { getGenres } from "@/lib/genres";
import { getScreenings } from "@/lib/screenings";
import { IScreeningGroup } from "@/interfaces/IScreenings";
import { SITE_URL } from "@/lib/site-config";
import {
  BASE_OPEN_GRAPH,
  NOINDEX_FOLLOW,
  hasQueryParams,
} from "@/lib/seo";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import SiteHeader from "@/components/common/site-header";
import SectionLoader from "@/components/ui/section-loader";
import Footer from "../../(home)/_components/footer";
import CinemaMapLazy from "./_components/cinema-map-lazy";
import CinemaRepertoire from "./_components/cinema-repertoire";

export const dynamic = "force-dynamic";

type SearchParams = {
  genres?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
};

type CinemaPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
};

export const generateMetadata = async ({
  params,
  searchParams,
}: CinemaPageProps): Promise<Metadata> => {
  const [{ slug }, queryParams] = await Promise.all([params, searchParams]);
  const cinema = await getCinemaBySlug(slug);

  const title = `${cinema.name} - kino studyjne ${cinema.city.name}`;
  const description = `${cinema.name} - kino studyjne w ${cinema.city.name}. Repertuar seansów specjalnych, klasyki filmowej i retrospektyw. Sprawdź co grają.`;
  const url = `${SITE_URL}/kina/${cinema.slug}`;

  const noindex = hasQueryParams(queryParams);

  return {
    title,
    description,
    ...(noindex ? NOINDEX_FOLLOW : { alternates: { canonical: url } }),
    openGraph: {
      ...BASE_OPEN_GRAPH,
      type: "website",
      title,
      description,
      url,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
};

const parseGenreIds = (raw: string | undefined): string[] => {
  if (!raw) return [];
  return raw
    .split(",")
    .map((v) => v.trim())
    .filter((v) => v.length > 0 && !Number.isNaN(Number(v)));
};

const mergeScreeningGroups = (
  groupArrays: IScreeningGroup[][]
): IScreeningGroup[] => {
  const map = new Map<number, IScreeningGroup>();
  for (const groups of groupArrays) {
    for (const group of groups) {
      if (!map.has(group.movie.id)) {
        map.set(group.movie.id, group);
      }
    }
  }
  return Array.from(map.values());
};

const CinemaPageContent = async ({
  slug,
  searchParams,
}: {
  slug: string;
  searchParams: SearchParams;
}) => {
  const genreIds = parseGenreIds(searchParams.genres);
  const sharedFilters = {
    dateFrom: searchParams.dateFrom,
    dateTo: searchParams.dateTo,
    search: searchParams.search,
  };

  const [{ cinema }, allGenres] = await Promise.all([
    getCinemaPageData(slug),
    getGenres(),
  ]);

  const screenings =
    genreIds.length > 1
      ? mergeScreeningGroups(
          await Promise.all(
            genreIds.map((id) =>
              getScreenings({
                cinemaId: cinema.id.toString(),
                genreId: id,
                ...sharedFilters,
              })
            )
          )
        )
      : await getScreenings({
          cinemaId: cinema.id.toString(),
          genreId: genreIds[0] ?? null,
          ...sharedFilters,
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
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-medium uppercase -tracking-[0.02em] leading-[1] text-white max-w-[20ch]">
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
                    rel="noreferrer noopener nofollow"
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

      <CinemaRepertoire
        cinemaName={cinema.name}
        citySlug={cinema.city.slug}
        cityName={cinema.city.name}
        cityForCopy={cityForCopy}
        screenings={screenings}
        genres={allGenres}
      />
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
