import { Metadata } from "next";
import { Suspense } from "react";
import SectionHeader from "@/components/common/section-header";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import ScreeningsPageContent from "./_components/screenings-page-content";
import ScreeningsPageLoader from "./_components/screenings-page-loader";
import { SITE_URL } from "@/lib/site-config";

export const revalidate = 300;

type SearchParams = {
  city?: string;
  genre?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  page?: string;
};

interface ScreeningsPageProps {
  searchParams: Promise<SearchParams>;
}

const hasQueryParams = (params: SearchParams) =>
  Object.values(params).some(
    (value) => typeof value === "string" && value.trim().length > 0
  );

const ScreeningsPage = async ({ searchParams }: ScreeningsPageProps) => {
  const params = await searchParams;

  return (
    <main className="bg-black min-h-screen px-8 py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-16">
        <div className="flex flex-col gap-6">
          <Breadcrumbs items={[{ name: "Seanse", href: "/seanse" }]} />
          <SectionHeader
            prefix="Repertuar"
            title="Seanse"
          description="Pełna lista seansów specjalnych i klasyki filmowej w kinach studyjnych w całej Polsce."
          />
        </div>

        <Suspense fallback={<ScreeningsPageLoader />}>
          <ScreeningsPageContent searchParams={params} />
        </Suspense>
      </div>
    </main>
  );
};

export const generateMetadata = async ({
  searchParams,
}: ScreeningsPageProps): Promise<Metadata> => {
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

export default ScreeningsPage;
