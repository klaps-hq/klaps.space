import { getGenreBySlug } from "@/lib/genres";
import { getScreenings } from "@/lib/screenings";
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
  description: `Filmy z gatunku ${genre.name.toLowerCase()} w repertuarze kin studyjnych.`,
  // Freshness signal for AI Overviews: newest movie `updatedAt` in the set,
  // i.e. a real data change. Omitted when no movie carries a timestamp,
  // which beats fabricating render time.
  ...(newestUpdatedAtIso(movies) && {
    dateModified: newestUpdatedAtIso(movies),
  }),
  // Omitted when nothing is upcoming: an empty list says nothing.
  ...(movies.length > 0 && {
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
  }),
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

  // The page renders upcoming screenings, so the ItemList mirrors those
  // films rather than the genre's catalogue: catalogue entries without
  // screenings are noindex pages. Same call as the page body, deduped by
  // the fetch cache.
  const movies = (await getScreenings({ genreId: genre.id.toString() }))
    .map((group) => group.movie)
    .slice(0, 24);

  return (
    <>
      <JsonLd data={buildGenreJsonLd(genre, movies)} />
      {children}
    </>
  );
}
