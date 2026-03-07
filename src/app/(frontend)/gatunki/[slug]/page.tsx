import { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { getGenreBySlug, getGenres } from "@/lib/genres";
import { getMovies } from "@/lib/movies";
import { getScreenings } from "@/lib/screenings";
import SectionHeader from "@/components/common/section-header";
import GenreMovies from "./_components/genre-movies";
import PaginatedNav from "@/components/common/paginated-nav";
import JsonLd from "@/components/common/json-ld";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import { SITE_URL } from "@/lib/site-config";
import { IGenre, IMovieSummary } from "@/interfaces/IMovies";

export const revalidate = 300;

type GenrePageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
};

const hasQueryParams = (params: Record<string, string | undefined>) =>
  Object.values(params).some(
    (value) => typeof value === "string" && value.trim().length > 0
  );

const buildGenreJsonLd = (genre: IGenre, movies: readonly IMovieSummary[]) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: `${genre.name} - Filmy`,
  url: `${SITE_URL}/gatunki/${genre.slug}`,
  description: `Filmy z gatunku ${genre.name.toLowerCase()} dostępne w serwisie Klaps.`,
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: movies.length,
    itemListElement: movies.map((movie, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}/filmy/${movie.slug}`,
      name: movie.title,
    })),
  },
});

const GenrePage = async ({ params, searchParams }: GenrePageProps) => {
  const { slug } = await params;
  const queryParams = await searchParams;
  const page = queryParams.page;

  let genre: IGenre;

  try {
    genre = await getGenreBySlug(slug);
    if (genre.slug !== slug) {
      permanentRedirect(`/gatunki/${genre.slug}`);
    }
  } catch {
    notFound();
  }

  const [{ data: movies, meta }, screeningGroups, allGenres] =
    await Promise.all([
      getMovies({
        genreId: genre.id.toString(),
        page: page ? Number(page) : 1,
        limit: 24,
      }),
      getScreenings({
        genreId: genre.id.toString(),
        limit: 500,
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
    <>
      <JsonLd data={buildGenreJsonLd(genre, movies)} />
      <main className="bg-black min-h-screen px-8 py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-16">
          <Breadcrumbs
            items={[
              { name: "Gatunki", href: "/gatunki" },
              { name: genre.name },
            ]}
          />

          <SectionHeader
            prefix="Gatunek"
            title={genre.name}
            description={genre?.description ?? undefined}
          />

          <GenreMovies movies={movies} />

          {cinemas.length > 0 && (
            <section className="flex flex-col gap-4">
              <h2 className="text-2xl md:text-3xl font-semibold uppercase text-white tracking-wide">
                Gdzie obejrzeć {genre.name.toLowerCase()}
              </h2>
              <p className="text-white/80 max-w-4xl">
                Kina studyjne, które aktualnie pokazują filmy z gatunku{" "}
                {genre.name.toLowerCase()}.
              </p>
              <div className="flex flex-wrap gap-2">
                {cinemas.map((cinema) => (
                  <Link
                    key={cinema.id}
                    href={`/kina/${cinema.slug}`}
                    className="inline-flex border border-white/15 px-3 py-1 text-xs uppercase tracking-widest text-white/80 hover:text-blood-red hover:border-blood-red/40 transition-colors"
                  >
                    {cinema.name}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {relatedGenres.length > 0 && (
            <section className="flex flex-col gap-4">
              <h2 className="text-2xl md:text-3xl font-semibold uppercase text-white tracking-wide">
                Zobacz też
              </h2>
              <div className="flex flex-wrap gap-2">
                {relatedGenres.map((item) => (
                  <Link
                    key={item.id}
                    href={`/gatunki/${item.slug}`}
                    className="inline-flex border border-white/15 px-3 py-1 text-xs uppercase tracking-widest text-white/80 hover:text-blood-red hover:border-blood-red/40 transition-colors"
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
    </>
  );
};

export const generateMetadata = async ({
  params,
  searchParams,
}: GenrePageProps): Promise<Metadata> => {
  const { slug } = await params;
  const queryParams = await searchParams;

  let genre;

  try {
    genre = await getGenreBySlug(slug);
  } catch {
    return { title: "Gatunek" };
  }

  const genreLower = genre.name.toLowerCase();
  const title = `${genre.name} - filmy w kinach studyjnych`;
  const description = `Filmy z gatunku ${genreLower} dostępne w kinach studyjnych w Polsce. Seanse specjalne, klasyka filmowa i retrospektywy - ${genreLower} na dużym ekranie.`;
  const url = `${SITE_URL}/gatunki/${genre.slug}`;
  const image = `${SITE_URL}/klaps-og.png`;

  return {
    title,
    description,
    keywords: [
      `${genreLower} kino studyjne`,
      `filmy ${genreLower}`,
      `${genreLower} seanse specjalne`,
      `${genreLower} klasyka filmowa`,
    ],
    alternates: {
      canonical: url,
    },
    ...(hasQueryParams(queryParams) && {
      robots: {
        index: false,
        follow: true,
      },
    }),
    openGraph: {
      title,
      description,
      url,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${genre.name} - filmy w kinach studyjnych`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
};

export default GenrePage;
