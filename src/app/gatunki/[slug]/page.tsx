import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGenreBySlug } from "@/lib/genres";
import { getMovies } from "@/lib/movies";
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
  searchParams: Promise<{ page?: string }>;
};

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
  const { page } = await searchParams;

  let genre;

  try {
    genre = await getGenreBySlug(slug);
  } catch {
    notFound();
  }

  const { data: movies, meta } = await getMovies({
    genreId: genre.id.toString(),
    page: page ? Number(page) : 1,
    limit: 24,
  });

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
            description={`Filmy z gatunku ${genre.name.toLowerCase()} dostępne w kinach studyjnych w Polsce.`}
          />

          <GenreMovies movies={movies} />

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
}: GenrePageProps): Promise<Metadata> => {
  const { slug } = await params;

  let genre;

  try {
    genre = await getGenreBySlug(slug);
  } catch {
    return { title: "Gatunek" };
  }

  const genreLower = genre.name.toLowerCase();
  const title = `${genre.name} - filmy w kinach studyjnych`;
  const description = `Filmy z gatunku ${genreLower} dostępne w kinach studyjnych w Polsce. Seanse specjalne, klasyka filmowa i retrospektywy - ${genreLower} na dużym ekranie.`;

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
      canonical: `${SITE_URL}/gatunki/${slug}`,
    },
    openGraph: {
      title,
      description,
    },
  };
};

export default GenrePage;
