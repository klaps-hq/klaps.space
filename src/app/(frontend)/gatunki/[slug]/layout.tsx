import { Metadata } from "next";
import { getGenreBySlug } from "@/lib/genres";
import { getMovies } from "@/lib/movies";
import { SITE_URL } from "@/lib/site-config";
import { IGenre, IMovieSummary } from "@/interfaces/IMovies";
import JsonLd from "@/components/common/json-ld";

type GenreLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

type GenrePageParams = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
};

const hasQueryParams = (params: Record<string, string | undefined> | null | undefined) =>
  params != null &&
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

export const generateMetadata = async ({
  params,
  searchParams,
}: GenrePageParams): Promise<Metadata> => {
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

export default async function GenreLayout({
  children,
  params,
}: Readonly<GenreLayoutProps>) {
  const { slug } = await params;

  let genre: IGenre;
  try {
    genre = await getGenreBySlug(slug);
  } catch {
    return children;
  }

  const { data: movies } = await getMovies({
    genreId: genre.id.toString(),
    limit: 24,
  });

  return (
    <>
      <JsonLd data={buildGenreJsonLd(genre, movies)} />
      {children}
    </>
  );
}
