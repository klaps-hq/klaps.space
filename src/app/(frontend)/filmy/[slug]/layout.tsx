import { Metadata } from "next";
import { getMovieBySlug } from "@/lib/movies";
import { tmdbImageUrl } from "@/lib/tmdb";
import { SITE_URL } from "@/lib/site-config";
import { IMovie } from "@/interfaces/IMovies";
import JsonLd from "@/components/common/json-ld";

type MovieLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

type MoviePageParams = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const hasQueryParams = (params: Record<string, string | string[] | undefined> | null | undefined) =>
  params != null &&
  Object.values(params).some((value) =>
    Array.isArray(value)
      ? value.some((item) => item.trim().length > 0)
      : typeof value === "string" && value.trim().length > 0
  );

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

export const generateMetadata = async ({
  params,
  searchParams,
}: MoviePageParams): Promise<Metadata> => {
  const { slug } = await params;
  const queryParams = searchParams ? await searchParams : {};
  const movie = await getMovieBySlug(slug);

  const genreNames = movie.genres.map((g) => g.name).join(", ");
  const directorNames = movie.directors?.map((d) => d.name).join(", ");

  const descriptionParts = [
    `${movie.title} (${movie.productionYear})`,
    genreNames && `- ${genreNames}`,
    directorNames && `reż. ${directorNames}`,
    "- seanse specjalne w kinach studyjnych w Polsce.",
  ].filter(Boolean);

  const description = movie.description
    ? `${movie.description.slice(0, 130)} Sprawdź seanse w kinach studyjnych.`
    : descriptionParts.join(" ");

  const title = `${movie.title} - seanse w kinach (${movie.productionYear})`;

  return {
    title,
    description,
    keywords: [
      movie.title,
      movie.titleOriginal,
      `${movie.title} seanse w kinach`,
      `${movie.title} kino`,
      `${movie.title} seans specjalny`,
      ...movie.genres.map((g) => g.name.toLowerCase()),
    ].filter(Boolean) as string[],
    alternates: {
      canonical: `${SITE_URL}/filmy/${movie.slug}`,
    },
    ...(hasQueryParams(queryParams) && {
      robots: {
        index: false,
        follow: true,
      },
    }),
    openGraph: {
      title: `${movie.title} - seanse w kinach`,
      description,
      ...(movie.posterUrl && {
        images: [{ url: tmdbImageUrl(movie.posterUrl, "w780"), alt: movie.title }],
      }),
    },
  };
};

export default async function MovieLayout({
  children,
  params,
}: Readonly<MovieLayoutProps>) {
  const { slug } = await params;
  const movie = await getMovieBySlug(slug);

  return (
    <>
      <JsonLd data={buildMovieJsonLd(movie)} />
      {children}
    </>
  );
}
