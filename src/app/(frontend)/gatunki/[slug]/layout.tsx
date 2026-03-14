import { Metadata } from "next";
import { getGenreBySlug } from "@/lib/genres";
import { SITE_URL } from "@/lib/site-config";

type GenreLayoutProps = {
  children: React.ReactNode;
};

type GenrePageParams = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
};

const hasQueryParams = (params: Record<string, string | undefined>) =>
  Object.values(params).some(
    (value) => typeof value === "string" && value.trim().length > 0
  );

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

export default function GenreLayout({ children }: Readonly<GenreLayoutProps>) {
  return children;
}
