import { getCinemas } from "@/lib/cinemas";
import { getMovies } from "@/lib/movies";
import { getGenres } from "@/lib/genres";
import SectionHeader from "@/components/common/section-header";
import SitemapContent from "./_components/sitemap-content";

export const revalidate = 300;

const SitemapPage = async () => {
  const [{ data: cinemaGroups }, { data: movies }, genres] = await Promise.all([
    getCinemas(),
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

export default SitemapPage;
