import { Metadata } from "next";
import { getCinemas } from "@/lib/cinemas";
import { SITE_URL } from "@/lib/site-config";
import { getMovies } from "@/lib/movies";
import { getGenres } from "@/lib/genres";
import SectionHeader from "@/components/common/section-header";
import SitemapContent from "./_components/sitemap-content";

export const revalidate = 300;

const SitemapPage = async () => {
  const [{ data: cinemaGroups }, { data: movies }, genres] = await Promise.all([
    getCinemas({ limit: 500 }),
    getMovies({ limit: 1000 }),
    getGenres(),
  ]);

  return (
    <main className="bg-black min-h-screen px-8 md:px-16 pt-28 pb-32 md:pb-40">
      <div className="max-w-[1100px] mx-auto flex flex-col gap-16">
        <SectionHeader
          prefix="Mapa witryny"
          title="Wszystkie podstrony"
          description="Przeglądaj wszystkie dostępne strony serwisu Klaps w jednym miejscu."
        />

        <SitemapContent
          cinemaGroups={cinemaGroups}
          movies={movies}
          genres={genres}
        />
      </div>
    </main>
  );
};

export const metadata: Metadata = {
  title: "Mapa witryny",
  description:
    "Mapa witryny serwisu Klaps. Przeglądaj wszystkie dostępne strony i podstrony w jednym miejscu.",
  alternates: {
    canonical: `${SITE_URL}/mapa-witryny`,
  },
};

export default SitemapPage;
