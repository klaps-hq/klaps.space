import { Metadata } from "next";
import { getScreeningById } from "@/lib/screenings";
import { tmdbImageUrl } from "@/lib/tmdb";
import { SITE_URL } from "@/lib/site-config";

type ScreeningLayoutProps = {
  children: React.ReactNode;
};

type ScreeningPageParams = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const hasQueryParams = (params: Record<string, string | string[] | undefined> | null | undefined) =>
  params != null &&
  Object.values(params).some((value) =>
    Array.isArray(value)
      ? value.some((item) => item.trim().length > 0)
      : typeof value === "string" && value.trim().length > 0
  );

export const generateMetadata = async ({
  params,
  searchParams,
}: ScreeningPageParams): Promise<Metadata> => {
  const { id } = await params;
  const queryParams = searchParams ? await searchParams : {};
  const { movie, screening } = await getScreeningById(Number(id));

  const dateFormatted = new Date(screening.dateTime).toLocaleDateString(
    "pl-PL",
    { day: "numeric", month: "long", year: "numeric" }
  );

  const title = `${movie.title} - seans w ${screening.cinema.name}, ${screening.cinema.city.name}`;
  const description = movie.description
    ? `${movie.description.slice(0, 100)} Seans ${dateFormatted} w ${screening.cinema.name}, ${screening.cinema.city.name}.`
    : `${movie.title} (${movie.productionYear}) - seans specjalny ${dateFormatted} w ${screening.cinema.name}, ${screening.cinema.city.name}.`;

  return {
    title,
    description,
    keywords: [
      movie.title,
      `${movie.title} seans`,
      screening.cinema.name,
      `seans specjalny ${screening.cinema.city.name}`,
    ],
    alternates: {
      canonical: `${SITE_URL}/seanse/${screening.id}`,
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
      ...(movie.posterUrl && {
        images: [{ url: tmdbImageUrl(movie.posterUrl, "w780"), alt: movie.title }],
      }),
    },
  };
};

export default function ScreeningLayout({
  children,
}: Readonly<ScreeningLayoutProps>) {
  return children;
}
