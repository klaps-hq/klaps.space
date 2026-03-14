import Link from "next/link";
import { getMovies } from "@/lib/movies";
import { getGenres } from "@/lib/genres";
import SectionHeader from "@/components/common/section-header";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import MoviesGrid from "./_components/movies-grid";
import MoviesPageFilters from "./_components/movies-page-filters";
import PaginatedNav from "@/components/common/paginated-nav";

const PAGE_LIMIT = 24;
export const revalidate = 300;

type MoviesPageProps = {
  searchParams: Promise<{ page?: string; search?: string; genre?: string }>;
};

const MoviesPage = async ({ searchParams }: MoviesPageProps) => {
  const params = await searchParams;
  const { page, search, genre } = params;

  const [{ data: movies, meta }, genres] = await Promise.all([
    getMovies({
      page: page ? Number(page) : 1,
      limit: PAGE_LIMIT,
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

  const genreLinks = [...genres]
    .sort((a, b) => a.name.localeCompare(b.name, "pl"))
    .slice(0, 12);

  return (
    <main className="bg-black min-h-screen px-8 py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-16">
        <div className="flex flex-col gap-6">
          <Breadcrumbs items={[{ name: "Filmy", href: "/filmy" }]} />
          <SectionHeader
            prefix="Katalog"
            title="Filmy"
            description="Klasyka, retrospektywy i seanse specjalne w kinach studyjnych w całej Polsce."
          />
        </div>

        <MoviesPageFilters genres={genres} />
        <MoviesGrid movies={movies} showHoverOverlay={false} />

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl md:text-3xl font-semibold uppercase text-white tracking-wide">
            Stare filmy w kinach
          </h2>

          <p className="text-white/80 max-w-4xl">
            Odkrywaj klasykę i retrospektywy na dużym ekranie. Przeglądaj
            repertuar według gatunku albo sprawdź kina studyjne, które aktualnie
            pokazują starsze filmy.
          </p>

          <div className="flex flex-wrap gap-2">
            {genreLinks.map((item) => (
              <Link
                key={item.id}
                href={`/gatunki/${item.slug}`}
                className="inline-flex border border-white/15 px-3 py-1 text-xs uppercase tracking-widest text-white/80 hover:text-blood-red hover:border-blood-red/40 transition-colors"
              >
                {item.name}
              </Link>
            ))}

            <Link
              href="/kina"
              className="inline-flex border border-white/15 px-3 py-1 text-xs uppercase tracking-widest text-white/80 hover:text-blood-red hover:border-blood-red/40 transition-colors"
            >
              Wszystkie kina studyjne
            </Link>
          </div>
        </section>

        <PaginatedNav
          currentPage={meta.page}
          totalPages={meta.totalPages}
          buildHref={buildPaginationHref}
        />
      </div>
    </main>
  );
};

export default MoviesPage;
