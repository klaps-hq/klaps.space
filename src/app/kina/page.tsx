import { Metadata } from "next";
import { getCinemas } from "@/lib/cinemas";
import { SITE_URL } from "@/lib/site-config";
import SectionHeader from "@/components/common/section-header";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import CinemasList from "./_components/cinemas-list";

export const revalidate = 300;

const CinemasPage = async () => {
  const { data: cinemaGroups } = await getCinemas({ limit: 200 });

  return (
    <main className="bg-black min-h-screen px-8 py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-16">
        <div className="flex flex-col gap-6">
          <Breadcrumbs items={[{ name: "Kina", href: "/kina" }]} />
          <SectionHeader
            prefix="Lista kin"
            title="Kina studyjne w Polsce"
            description="Miejsca, w których kino jest czymś więcej niż rozrywką."
          />
        </div>

        <CinemasList cinemaGroups={cinemaGroups} />
      </div>
    </main>
  );
};

export const metadata: Metadata = {
  title: "Kina studyjne w Polsce",
  description:
    "Pełna lista kin studyjnych i niezależnych w Polsce. Znajdź kino artystyczne w swoim mieście i sprawdź aktualny repertuar seansów specjalnych.",
  keywords: [
    "kina studyjne w Polsce",
    "kina niezależne",
    "kino artystyczne",
    "lista kin studyjnych",
    "kino studyjne w moim mieście",
  ],
  alternates: {
    canonical: `${SITE_URL}/kina`,
  },
  openGraph: {
    title: "Kina studyjne w Polsce",
    description:
      "Pełna lista kin studyjnych i niezależnych w Polsce. Znajdź kino artystyczne w swoim mieście i sprawdź aktualny repertuar seansów specjalnych.",
    url: `${SITE_URL}/kina`,
    images: [
      {
        url: `${SITE_URL}/klaps-og.png`,
        width: 1200,
        height: 630,
        alt: "Kina studyjne w Polsce",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kina studyjne w Polsce",
    description:
      "Pełna lista kin studyjnych i niezależnych w Polsce. Znajdź kino artystyczne w swoim mieście i sprawdź aktualny repertuar seansów specjalnych.",
    images: [`${SITE_URL}/klaps-og.png`],
  },
};

export default CinemasPage;
