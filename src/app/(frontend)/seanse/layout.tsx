import { Metadata } from "next";
import { SITE_URL } from "@/lib/site-config";

type ScreeningsLayoutProps = {
  children: React.ReactNode;
};

type SearchParams = {
  city?: string;
  genre?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  page?: string;
};

const hasQueryParams = (params: SearchParams | null | undefined) =>
  params != null &&
  Object.values(params).some(
    (value) => typeof value === "string" && value.trim().length > 0
  );

export const generateMetadata = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> => {
  const params = await searchParams;
  const title = "Seanse specjalne w kinach studyjnych - repertuar";
  const description =
    "Aktualna lista seansów specjalnych, retrospektyw i klasyki filmowej w kinach studyjnych w całej Polsce. Filtruj po mieście, dacie i gatunku.";
  const url = `${SITE_URL}/seanse`;
  const image = `${SITE_URL}/klaps-og.png`;

  return {
    title,
    description,
    keywords: [
      "seanse specjalne",
      "repertuar kin studyjnych",
      "klasyka filmowa w kinie",
      "retrospektywy filmowe",
      "pokazy specjalne kino",
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
          alt: "Seanse specjalne w kinach studyjnych",
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

export default function ScreeningsLayout({
  children,
}: Readonly<ScreeningsLayoutProps>) {
  return children;
}
