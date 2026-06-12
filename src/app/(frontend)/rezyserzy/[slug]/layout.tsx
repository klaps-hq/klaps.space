import { getDirectorBySlug, getMoviesByDirector } from "@/lib/directors";
import { SITE_URL } from "@/lib/site-config";
import { newestUpdatedAtIso } from "@/lib/seo";
import { tmdbPhotoSrc } from "@/lib/tmdb";
import { IDirector } from "@/interfaces/IDirectors";
import { IMovieSummary } from "@/interfaces/IMovies";
import JsonLd from "@/components/common/json-ld";

type DirectorLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

const buildDirectorJsonLd = (
  director: IDirector,
  movies: readonly IMovieSummary[]
) => {
  const image = tmdbPhotoSrc(director.photoUrl, "w500");
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: director.name,
    jobTitle: "Reżyser",
    url: `${SITE_URL}/rezyserzy/${director.slug}`,
  };

  if (image) jsonLd.image = image;
  if (director.bio) jsonLd.description = director.bio;

  // Freshness signal: newest real data change across the director record and
  // the filmography. Omitted when nothing carries a timestamp.
  const dateModified = newestUpdatedAtIso([
    { updatedAt: director.updatedAt },
    ...movies,
  ]);
  if (dateModified) jsonLd.dateModified = dateModified;

  return jsonLd;
};

const buildFilmographyJsonLd = (
  director: IDirector,
  movies: readonly IMovieSummary[]
) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: `Filmografia - ${director.name}`,
  numberOfItems: movies.length,
  itemListElement: movies.map((movie, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: `${SITE_URL}/filmy/${movie.slug}`,
    name: movie.title,
  })),
});

export default async function DirectorLayout({
  children,
  params,
}: Readonly<DirectorLayoutProps>) {
  const { slug } = await params;

  let director: IDirector;
  try {
    director = await getDirectorBySlug(slug);
  } catch {
    return children;
  }

  const { data: movies } = await getMoviesByDirector(director.id);

  return (
    <>
      <JsonLd data={buildDirectorJsonLd(director, movies)} />
      {movies.length > 0 && (
        <JsonLd data={buildFilmographyJsonLd(director, movies)} />
      )}
      {children}
    </>
  );
}
