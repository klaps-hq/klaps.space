import { Suspense } from "react";
import { Metadata } from "next";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import SiteHeader from "@/components/common/site-header";
import Footer from "../(home)/_components/footer";
import { getPaginatedScreenings } from "@/lib/screenings";
import { getGenres } from "@/lib/genres";
import { getPreferredCityId } from "@/lib/get-preferred-city";
import { IScreeningGroup } from "@/interfaces/IScreenings";
import { PaginatedResponse } from "@/interfaces/IMovies";
import { SITE_URL } from "@/lib/site-config";
import {
  BASE_OPEN_GRAPH,
  NOINDEX_FOLLOW,
  hasQueryParams,
} from "@/lib/seo";
import ScreeningsPageSection from "./_components/screenings-page-section";
import ScreeningsPageLoader from "./_components/screenings-page-loader";

export const revalidate = 300;

const PAGE_SIZE = 30;

interface SearchParams {
  city?: string;
  genres?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  page?: string;
}

interface ScreeningsPageProps {
  searchParams: Promise<SearchParams>;
}

export const generateMetadata = async ({
  searchParams,
}: ScreeningsPageProps): Promise<Metadata> => {
  const queryParams = await searchParams;
  const title = "Seanse specjalne w kinach studyjnych - repertuar";
  const description =
    "Aktualna lista seansów specjalnych, retrospektyw i klasyki filmowej w kinach studyjnych w całej Polsce. Filtruj po mieście, dacie i gatunku.";
  const url = `${SITE_URL}/seanse`;

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
    .filter((v) => v.length > 0 && /^\d+$/.test(v));
};

const mergeScreeningGroups = (
  groups: IScreeningGroup[][]
): IScreeningGroup[] => {
  const byMovieId = new Map<number, IScreeningGroup>();
  for (const list of groups) {
    for (const group of list) {
      if (!byMovieId.has(group.movie.id)) {
        byMovieId.set(group.movie.id, group);
      }
    }
  }
  return Array.from(byMovieId.values());
};

const unwrapResponse = (
  response: IScreeningGroup[] | PaginatedResponse<IScreeningGroup>
): IScreeningGroup[] =>
  Array.isArray(response) ? response : [...response.data];

const ScreeningsListing = async ({ params }: { params: SearchParams }) => {
  const cityId = await getPreferredCityId(params);
  const genreIds = parseGenreIds(params.genres);
  const requestedPage = Math.max(1, Number(params.page || "1"));

  const sharedFilters = {
    cityId,
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
    search: params.search,
  };

  const allScreenings =
    genreIds.length > 1
      ? await Promise.all(
          genreIds.map((id) =>
            getPaginatedScreenings({ ...sharedFilters, genreId: id }).then(
              unwrapResponse
            )
          )
        ).then(mergeScreeningGroups)
      : await getPaginatedScreenings({
          ...sharedFilters,
          genreId: genreIds[0],
        }).then(unwrapResponse);

  const totalPages = Math.max(
    1,
    Math.ceil(allScreenings.length / PAGE_SIZE)
  );
  const currentPage = Math.min(requestedPage, totalPages);
  const screenings = allScreenings.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const genres = await getGenres();

  return (
    <ScreeningsPageSection
      screenings={screenings}
      genres={genres}
      selectedGenreIds={genreIds.map(Number)}
      dateFrom={params.dateFrom ?? null}
      dateTo={params.dateTo ?? null}
      search={params.search ?? null}
      currentPage={currentPage}
      totalPages={totalPages}
    />
  );
};

const ScreeningsPage = async ({ searchParams }: ScreeningsPageProps) => {
  const params = await searchParams;

  return (
    <main className="bg-black text-white min-h-screen">
      <SiteHeader />

      <div className="px-6 md:px-12 lg:px-16 pt-8 md:pt-10 pb-4">
        <Breadcrumbs items={[{ name: "Seanse", href: "/seanse" }]} />
      </div>

      <header className="px-6 md:px-12 lg:px-16 pt-6 md:pt-10 pb-10 md:pb-14">
        <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.05] -tracking-[0.02em] max-w-[26ch]">
          <span className="block text-white font-medium">
            Repertuar kin studyjnych.
          </span>
          <span className="block text-white/40">
            Klasyka i&nbsp;pokazy specjalne w&nbsp;całej Polsce.
          </span>
        </h1>
        <p className="mt-4 md:mt-5 max-w-[64ch] text-base md:text-lg text-white/55 leading-relaxed">
          Aktualny program niezależnych kin studyjnych w&nbsp;Polsce.
          Retrospektywy, klasyka kina autorskiego, pokazy z&nbsp;dyskusją
          i&nbsp;wydarzenia kuratorowane. Filtruj seanse po mieście, dacie
          i&nbsp;gatunku poniżej.
        </p>
      </header>

      <Suspense fallback={<ScreeningsPageLoader />}>
        <ScreeningsListing params={params} />
      </Suspense>

      <Footer />
    </main>
  );
};

export default ScreeningsPage;
