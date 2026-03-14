import { Metadata } from "next";
import { getMovieBySlug } from "@/lib/movies";
import { tmdbImageUrl } from "@/lib/tmdb";
import { SITE_URL } from "@/lib/site-config";

type MovieLayoutProps = {
  children: React.ReactNode;
};

type MoviePageParams = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const hasQueryParams = (params: Record<string, string | string[] | undefined>) =>
  Object.values(params).some((value) =>
    Array.isArray(value)
      ? value.some((item) => item.trim().length > 0)
      : typeof value === "string" && value.trim().length > 0
  );

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

export default function MovieLayout({ children }: Readonly<MovieLayoutProps>) {
  return children;
}
