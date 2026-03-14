import { Metadata } from "next";
import { SITE_URL } from "@/lib/site-config";

type MoviesLayoutProps = {
  children: React.ReactNode;
};

type MoviesSearchParams = {
  page?: string;
  search?: string;
  genre?: string;
};

const hasQueryParams = (params: MoviesSearchParams) =>
  Object.values(params).some(
    (value) => typeof value === "string" && value.trim().length > 0
  );

export const generateMetadata = async ({
  searchParams,
}: {
  searchParams: Promise<MoviesSearchParams>;
}): Promise<Metadata> => {
  const params = await searchParams;
  const title = "Filmy klasyczne i stare filmy w kinach - katalog";
  const description =
    "Katalog klasyki filmowej i stare filmy w kinach studyjnych w Polsce. Retrospektywy, wznowienia i seanse specjalne na dużym ekranie.";
  const url = `${SITE_URL}/filmy`;
  const image = `${SITE_URL}/klaps-og.png`;

  return {
    title,
    description,
    keywords: [
      "filmy klasyczne w kinach",
      "stare filmy w kinach",
      "retrospektywy filmowe",
      "wznowienia filmowe",
      "katalog filmów kina studyjne",
    ],
    alternates: {
      canonical: url,
    },
    ...(hasQueryParams(params) && {
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
          alt: "Filmy klasyczne i stare filmy w kinach studyjnych",
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

export default function MoviesLayout({ children }: Readonly<MoviesLayoutProps>) {
  return children;
}
