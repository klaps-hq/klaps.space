import React from "react";
import Link from "next/link";
import { getGenrePageData, getGenres } from "@/lib/genres";
import { getMovies } from "@/lib/movies";
import { getScreenings } from "@/lib/screenings";
import { IMovieSummary } from "@/interfaces/IMovies";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import SiteHeader from "@/components/common/site-header";
import MoviePoster from "@/components/common/movie-poster";
import PaginatedNav from "@/components/common/paginated-nav";
import Footer from "../../(home)/_components/footer";

export const revalidate = 300;

const MOVIES_PER_PAGE = 24;

type GenrePageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
};

interface MovieCardProps {
  movie: IMovieSummary;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => (
  <Link
    href={`/filmy/${movie.slug}`}
    className="group flex flex-col gap-2.5"
    aria-label={`Przejdź do filmu: ${movie.title}`}
  >
    <div className="relative aspect-[2/3] overflow-hidden bg-white/5">
      {movie.posterUrl ? (
        <MoviePoster
          posterUrl={movie.posterUrl}
          title={movie.title}
          width={400}
          height={600}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-white/30 text-[10px] uppercase tracking-[0.25em]">
          Bez plakatu
        </div>
      )}
    </div>
    <div className="flex flex-col gap-1 min-w-0">
      <h3 className="text-xs md:text-sm font-semibold uppercase leading-tight tracking-tight text-white line-clamp-2 group-hover:text-white/90">
        {movie.title}
      </h3>
      {movie.productionYear && (
        <span className="text-[9px] md:text-[10px] uppercase tracking-[0.18em] text-white/45">
          {movie.productionYear}
        </span>
      )}
    </div>
  </Link>
);

const GenrePage = async ({ params, searchParams }: GenrePageProps) => {
  const { slug } = await params;
  const queryParams = await searchParams;
  const page = queryParams.page ? Number(queryParams.page) : 1;

  const genre = await getGenrePageData(slug);

  const [{ data: movies, meta }, screeningGroups, allGenres] =
    await Promise.all([
      getMovies({
        genreId: genre.id.toString(),
        page,
        limit: MOVIES_PER_PAGE,
      }),
      getScreenings({
        genreId: genre.id.toString(),
      }),
      getGenres(),
    ]);

  const cinemas = Array.from(
    new Map(
      screeningGroups
        .flatMap((group) =>
          group.screenings.map((screening) => screening.cinema)
        )
        .map((cinema) => [cinema.slug, cinema])
    ).values()
  )
    .sort((a, b) => a.name.localeCompare(b.name, "pl"))
    .slice(0, 12);

  const relatedGenres = allGenres
    .filter((item) => item.slug !== genre.slug)
    .sort((a, b) => a.name.localeCompare(b.name, "pl"))
    .slice(0, 10);

  const buildPaginationHref = (targetPage: number) => {
    const urlParams = new URLSearchParams();
    urlParams.set("page", targetPage.toString());
    return `/gatunki/${slug}?${urlParams.toString()}`;
  };

  const genreNameLower = genre.name.toLowerCase();

  return (
    <main className="bg-black text-white min-h-screen">
      <SiteHeader />

      <div className="px-6 md:px-12 lg:px-16 pt-8 md:pt-10 pb-4">
        <Breadcrumbs
          items={[
            { name: "Gatunki", href: "/gatunki" },
            { name: genre.name },
          ]}
        />
      </div>

      <header className="px-6 md:px-12 lg:px-16 pt-6 md:pt-8 pb-12 md:pb-16">
        <Link
          href="/gatunki"
          className="inline-block w-fit text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/40 hover:text-white/80 transition-colors mb-3 md:mb-4"
        >
          Gatunek
        </Link>
        <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-medium uppercase -tracking-[0.03em] leading-[0.95] text-white max-w-[20ch]">
          {genre.name}
        </h1>
        {genre.description ? (
          <p className="mt-8 md:mt-10 max-w-[64ch] text-base md:text-lg text-white/65 leading-relaxed">
            {genre.description}
          </p>
        ) : (
          <p className="mt-8 md:mt-10 max-w-[64ch] text-base md:text-lg text-white/55 leading-relaxed">
            Filmy z&nbsp;gatunku {genreNameLower} pokazywane aktualnie
            w&nbsp;polskich kinach studyjnych. Klasyka, retrospektywy i&nbsp;pokazy
            specjalne w&nbsp;niezależnych ekranach z&nbsp;całej Polski.
          </p>
        )}
      </header>

      <section className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-12 md:pt-16 pb-16 md:pb-20">
        <div className="mb-8 md:mb-10 flex items-end justify-between gap-6 flex-wrap">
          <h2 className="text-2xl md:text-4xl lg:text-5xl leading-[1.05] -tracking-[0.02em] max-w-[26ch] text-white font-medium">
            Filmy z&nbsp;tego gatunku.
          </h2>
          {meta.total > 0 && (
            <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/40 tabular-nums">
              {meta.total} {meta.total === 1 ? "film" : "filmów"}
            </span>
          )}
        </div>

        {movies.length === 0 ? (
          <p className="text-base md:text-lg text-white/55 max-w-[48ch]">
            Brak filmów do wyświetlenia.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-x-4 md:gap-x-6 gap-y-10 md:gap-y-12">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
            {meta.totalPages > 1 && (
              <div className="mt-16 md:mt-20">
                <PaginatedNav
                  currentPage={meta.page}
                  totalPages={meta.totalPages}
                  buildHref={buildPaginationHref}
                />
              </div>
            )}
          </>
        )}
      </section>

      {cinemas.length > 0 && (
        <section className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-12 md:pt-16 pb-16 md:pb-20">
          <div className="mb-6 md:mb-8">
            <h2 className="text-2xl md:text-4xl lg:text-5xl leading-[1.05] -tracking-[0.02em] max-w-[26ch] text-white font-medium">
              Gdzie obejrzeć.
            </h2>
            <p className="mt-3 md:mt-4 max-w-[64ch] text-sm md:text-base text-white/55">
              Kina studyjne, które aktualnie pokazują filmy z&nbsp;gatunku{" "}
              {genreNameLower}.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {cinemas.map((cinema) => (
              <Link
                key={cinema.id}
                href={`/kina/${cinema.slug}`}
                className="inline-flex h-9 items-center px-3.5 border border-white/25 text-[11px] uppercase tracking-wider text-white/80 hover:border-white hover:text-white transition-colors whitespace-nowrap"
              >
                {cinema.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {relatedGenres.length > 0 && (
        <section className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-12 md:pt-16 pb-20 md:pb-28">
          <div className="mb-8 md:mb-10 flex items-end justify-between gap-6 flex-wrap">
            <h2 className="text-2xl md:text-4xl lg:text-5xl leading-[1.05] -tracking-[0.02em] max-w-[26ch] text-white font-medium">
              Inne gatunki
            </h2>
            <Link
              href="/gatunki"
              className="group inline-flex items-baseline gap-2 text-[10px] md:text-xs uppercase tracking-[0.28em] text-white/55 hover:text-white transition-colors border-b border-transparent hover:border-white/40 pb-0.5"
            >
              Wszystkie gatunki
              <span
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 border-t border-l border-white/10">
            {relatedGenres.map((item) => (
              <Link
                key={item.id}
                href={`/gatunki/${item.slug}`}
                className="group bg-black hover:bg-white/[0.04] transition-colors border-r border-b border-white/10 px-4 md:px-5 py-5 md:py-6 flex items-center"
              >
                <span className="text-sm md:text-base font-medium uppercase -tracking-[0.01em] text-white/65 group-hover:text-white transition-colors">
                  {item.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
};

export default GenrePage;
