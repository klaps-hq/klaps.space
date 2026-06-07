import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/common/json-ld";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import PageHeading, {
  PageHeadingMuted,
} from "@/components/ui/page-heading";
import SiteHeader from "@/components/common/site-header";
import Footer from "../(home)/_components/footer";
import {
  getPaginatedScreenings,
  getScreeningsLastUpdated,
} from "@/lib/screenings";
import { getGenres } from "@/lib/genres";
import { getPreferredLocation } from "@/lib/get-preferred-city";
import { IScreeningGroup } from "@/interfaces/IScreenings";
import { PaginatedResponse } from "@/interfaces/IMovies";
import { SITE_URL } from "@/lib/site-config";
import {
  BASE_OPEN_GRAPH,
  NOINDEX_FOLLOW,
  formatPlDate,
  hasFilterParams,
} from "@/lib/seo";
import ScreeningsPageSection from "./_components/screenings-page-section";
import ScreeningsPageLoader from "./_components/screenings-page-loader";

export const revalidate = 300;

const PAGE_SIZE = 30;

interface SearchParams {
  city?: string;
  voivodeship?: string;
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
  const description =
    "Aktualna lista seansów specjalnych, retrospektyw i klasyki filmowej w kinach studyjnych w całej Polsce. Filtruj po mieście, dacie i gatunku.";
  const url = `${SITE_URL}/seanse`;

  // Filtered views are duplicates of the base listing: noindex.
  // Unknown params (utm_* etc.) fall through to the canonical below.
  if (hasFilterParams(queryParams)) {
    return {
      title: "Seanse specjalne w kinach studyjnych - repertuar",
      description,
      ...NOINDEX_FOLLOW,
    };
  }

  // Plain pagination stays indexable: unique title + self-canonical,
  // so the deeper parts of the listing keep their crawl path.
  const pageNumber = Number(queryParams.page);
  const isPaginated = Number.isInteger(pageNumber) && pageNumber >= 2;

  const title = isPaginated
    ? `Seanse specjalne w kinach studyjnych - repertuar (strona ${pageNumber})`
    : "Seanse specjalne w kinach studyjnych - repertuar";
  const canonical = isPaginated ? `${url}?page=${pageNumber}` : url;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      ...BASE_OPEN_GRAPH,
      type: "website",
      title,
      description,
      url: canonical,
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
  const { cityId, voivodeship } = await getPreferredLocation(params);
  const genreIds = parseGenreIds(params.genres);
  const requestedPage = Math.max(1, Number(params.page || "1"));

  const sharedFilters = {
    cityId,
    voivodeship,
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

  const [genres, lastUpdated] = await Promise.all([
    getGenres(),
    getScreeningsLastUpdated({ cityId, voivodeship }),
  ]);

  return (
    <>
      <JsonLd
        data={buildScreeningsJsonLd(screenings, lastUpdated ?? new Date())}
      />
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
    </>
  );
};

// CollectionPage with the visible movie list mirrored as an ItemList,
// so AI search results get a machine-readable "what's playing" list.
// dateModified reflects the newest screening's updatedAt, i.e. when the
// repertoire data was last added (freshness signal for AI Overviews).
const buildScreeningsJsonLd = (
  screenings: IScreeningGroup[],
  dateModified: Date
) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Seanse specjalne w kinach studyjnych - repertuar",
  url: `${SITE_URL}/seanse`,
  description:
    "Aktualna lista seansów specjalnych, retrospektyw i klasyki filmowej w kinach studyjnych w całej Polsce.",
  dateModified: dateModified.toISOString(),
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: screenings.length,
    itemListElement: screenings.map((group, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}/filmy/${group.movie.slug}`,
      name: `${group.movie.title} (${group.movie.productionYear})`,
    })),
  },
});

const ScreeningsPage = async ({ searchParams }: ScreeningsPageProps) => {
  const params = await searchParams;
  const lastUpdated = (await getScreeningsLastUpdated()) ?? new Date();

  return (
    <main className="bg-black text-white min-h-screen">
      <SiteHeader />

      <div className="px-6 md:px-12 lg:px-16 pt-8 md:pt-10 pb-4">
        <Breadcrumbs items={[{ name: "Seanse", href: "/seanse" }]} />
      </div>

      <header className="px-6 md:px-12 lg:px-16 pt-6 md:pt-10 pb-10 md:pb-14">
        <PageHeading variant="editorial">
          Repertuar kin studyjnych.
          <PageHeadingMuted>
            Klasyka i&nbsp;pokazy specjalne w&nbsp;całej Polsce.
          </PageHeadingMuted>
        </PageHeading>
        <p className="mt-4 md:mt-5 max-w-[64ch] text-base md:text-lg text-white/55 leading-relaxed">
          Aktualny program niezależnych kin studyjnych w&nbsp;Polsce.
          Retrospektywy, klasyka kina autorskiego, pokazy z&nbsp;dyskusją
          i&nbsp;cykle tematyczne. Filtruj seanse po mieście, dacie
          i&nbsp;gatunku poniżej albo przeglądaj repertuar według{" "}
          <Link
            href="/gatunki"
            className="text-white/80 underline underline-offset-4 decoration-white/25 hover:text-white hover:decoration-white transition-colors"
          >
            gatunków
          </Link>{" "}
          i&nbsp;
          <Link
            href="/miasta"
            className="text-white/80 underline underline-offset-4 decoration-white/25 hover:text-white hover:decoration-white transition-colors"
          >
            miast
          </Link>
          .
        </p>
        {/* Visible freshness signal, mirrors dateModified in JSON-LD. */}
        <p className="mt-5 text-[10px] md:text-xs uppercase tracking-[0.25em] text-white/35">
          Repertuar zaktualizowano: {formatPlDate(lastUpdated)}
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
