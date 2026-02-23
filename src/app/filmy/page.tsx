import { Metadata } from "next";
import { getMovies } from "@/lib/movies";
import { getGenres } from "@/lib/genres";
import SectionHeader from "@/components/common/section-header";
import MoviesGrid from "./_components/movies-grid";
import MoviesPageFilters from "./_components/movies-page-filters";
import PaginatedNav from "@/components/common/paginated-nav";
import { SITE_URL } from "@/lib/site-config";

export const dynamic = "force-dynamic";

type MoviesPageProps = {
  searchParams: Promise<{ page?: string; search?: string; genre?: string }>;
};

const MoviesPage = async ({ searchParams }: MoviesPageProps) => {
  const params = await searchParams;
  const { page, search, genre } = params;

  const [{ data: movies, meta }, genres] = await Promise.all([
    getMovies({
      page: page ? Number(page) : 1,
      limit: 24,
      search,
      genreId: genre,
    }),
    getGenres(),
  ]);

  const buildPaginationHref = (targetPage: number) => {
    const urlParams = new URLSearchParams();
    urlParams.set("page", targetPage.toString());
    if (search) urlParams.set("search", search);
    if (genre) urlParams.set("genre", genre);
    return `/filmy?${urlParams.toString()}`;
  };

  return (
    <main className="bg-black min-h-screen px-8 py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-16">
        <SectionHeader
          prefix="Katalog"
          title="Filmy"
          description="Klasyka, retrospektywy i seanse specjalne w kinach studyjnych w całej Polsce."
        />

        <MoviesPageFilters genres={genres} />

        <MoviesGrid movies={movies} showHoverOverlay={false} />

        <PaginatedNav
          currentPage={meta.page}
          totalPages={meta.totalPages}
          buildHref={buildPaginationHref}
        />
      </div>
    </main>
  );
};

export const metadata: Metadata = {
  title: "Filmy",
  description:
    "Katalog filmów dostępnych w serwisie Klaps. Klasyka, retrospektywy i seanse specjalne w kinach studyjnych.",
  alternates: {
    canonical: `${SITE_URL}/filmy`,
  },
};

export default MoviesPage;
