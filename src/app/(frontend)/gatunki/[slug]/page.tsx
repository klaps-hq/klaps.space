import Link from "next/link";
import { getGenrePageData, getGenres } from "@/lib/genres";
import { getMovies } from "@/lib/movies";
import { getScreenings } from "@/lib/screenings";
import GenreMovies from "./_components/genre-movies";
import PaginatedNav from "@/components/common/paginated-nav";
import Breadcrumbs from "@/components/ui/breadcrumbs";

export const revalidate = 300;

type GenrePageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
};

const GenrePage = async ({ params, searchParams }: GenrePageProps) => {
  const { slug } = await params;
  const queryParams = await searchParams;
  const page = queryParams.page;

  const genre = await getGenrePageData(slug);

  const [{ data: movies, meta }, screeningGroups, allGenres] =
    await Promise.all([
      getMovies({
        genreId: genre.id.toString(),
        page: page ? Number(page) : 1,
        limit: 24,
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

  return (
    <main className="bg-black min-h-screen px-8 lg:px-12 xl:px-16 pt-28 md:pt-36 pb-16 md:pb-24">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-16">
        <div className="flex flex-col gap-6">
          <Breadcrumbs
            items={[
              { name: "Gatunki", href: "/gatunki" },
              { name: genre.name },
            ]}
          />

          <div className="flex flex-col gap-4">
            <p className="text-blood-red text-sm font-semibold uppercase tracking-[0.15em]">
              Gatunek
            </p>
            <h1 className="text-white text-4xl md:text-6xl font-black uppercase tracking-tight leading-none">
              {genre.name}
            </h1>
            <div className="h-0.5 w-10 bg-blood-red" />
            {genre.description && (
              <p className="text-neutral-400 text-base md:text-lg max-w-2xl leading-relaxed">
                {genre.description}
              </p>
            )}
          </div>
        </div>

        <GenreMovies movies={movies} />

        {cinemas.length > 0 && (
          <section className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <h2 className="text-white text-2xl md:text-3xl font-bold uppercase tracking-tight">
                Gdzie obejrzeć
              </h2>
              <p className="text-neutral-500 text-sm">
                Kina z aktualnymi seansami z gatunku{" "}
                {genre.name.toLowerCase()}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {cinemas.map((cinema) => (
                <Link
                  key={cinema.id}
                  href={`/kina/${cinema.slug}`}
                  className="inline-flex border border-white/[0.06] px-4 py-2 text-xs uppercase tracking-widest text-white/60 hover:text-blood-red hover:border-blood-red/30 transition-colors duration-300"
                >
                  {cinema.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {relatedGenres.length > 0 && (
          <section className="flex flex-col gap-5">
            <h2 className="text-white text-2xl md:text-3xl font-bold uppercase tracking-tight">
              Inne gatunki
            </h2>
            <div className="flex flex-wrap gap-2">
              {relatedGenres.map((item) => (
                <Link
                  key={item.id}
                  href={`/gatunki/${item.slug}`}
                  className="inline-flex border border-white/[0.06] px-4 py-2 text-xs uppercase tracking-widest text-white/60 hover:text-blood-red hover:border-blood-red/30 transition-colors duration-300"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        <PaginatedNav
          currentPage={meta.page}
          totalPages={meta.totalPages}
          buildHref={buildPaginationHref}
        />
      </div>
    </main>
  );
};

export default GenrePage;
