import { getGenreBySlug } from "@/lib/genres";
import { getMovies } from "@/lib/movies";
import { SITE_URL } from "@/lib/site-config";
import { newestUpdatedAtIso } from "@/lib/seo";
import { IGenre, IMovieSummary } from "@/interfaces/IMovies";
import JsonLd from "@/components/common/json-ld";

type GenreLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

const buildGenreJsonLd = (genre: IGenre, movies: readonly IMovieSummary[]) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: `${genre.name} - Filmy`,
  url: `${SITE_URL}/gatunki/${genre.slug}`,
  description: `Filmy z gatunku ${genre.name.toLowerCase()} dostępne w serwisie Klaps.`,
  // Freshness signal for AI Overviews: newest movie `updatedAt` in the set,
  // i.e. a real data change. Omitted when no movie carries a timestamp,
  // which beats fabricating render time.
  ...(newestUpdatedAtIso(movies) && {
    dateModified: newestUpdatedAtIso(movies),
  }),
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
