import { getMovieBySlug } from "@/lib/movies";
import { tmdbImageUrl } from "@/lib/tmdb";
import { SITE_URL } from "@/lib/site-config";
import { IMovie } from "@/interfaces/IMovies";
import JsonLd from "@/components/common/json-ld";

type MovieLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

const buildMovieJsonLd = (movie: IMovie) => {
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Movie",
    name: movie.title,
    url: `${SITE_URL}/filmy/${movie.slug}`,
    description: movie.description ?? undefined,
    dateCreated: movie.productionYear.toString(),
    genre: movie.genres.map((g) => g.name),
  };

  if (movie.titleOriginal) {
    jsonLd.alternateName = movie.titleOriginal;
  }

  if (movie.duration) {
    const hours = Math.floor(movie.duration / 60);
    const minutes = movie.duration % 60;
    jsonLd.duration = `PT${hours}H${minutes}M`;
  }

  if (movie.posterUrl) {
    jsonLd.image = tmdbImageUrl(movie.posterUrl, "w780");
  }

  if (movie.directors?.length) {
    jsonLd.director = movie.directors.map((d) => ({
      "@type": "Person",
      name: d.name,
    }));
  }

  if (movie.actors?.length) {
    jsonLd.actor = movie.actors.map((a) => ({
      "@type": "Person",
      name: a.name,
    }));
  }

  return jsonLd;
};

const buildMovieBreadcrumbJsonLd = (movie: IMovie) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Strona główna",
      item: SITE_URL,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Seanse",
      item: `${SITE_URL}/seanse`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: movie.title,
    },
  ],
});

export default async function MovieLayout({
  children,
  params,
}: Readonly<MovieLayoutProps>) {
  const { slug } = await params;
  const movie = await getMovieBySlug(slug);

  return (
    <>
      <JsonLd data={buildMovieJsonLd(movie)} />
      <JsonLd data={buildMovieBreadcrumbJsonLd(movie)} />
      {children}
    </>
  );
}
