import { getGenres } from "@/lib/genres";
import SectionHeader from "@/components/common/section-header";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import GenresList from "./_components/genres-list";

export const revalidate = 300;

const GenresPage = async () => {
  const genres = await getGenres();

  return (
    <main className="bg-black min-h-screen px-8 py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-16">
        <div className="flex flex-col gap-6">
          <Breadcrumbs items={[{ name: "Gatunki", href: "/gatunki" }]} />
          <SectionHeader
            prefix="Gatunki"
            title="Gatunki filmowe"
            description="Przeglądaj filmy i seanse specjalne w kinach studyjnych według gatunku."
          />
        </div>

        <GenresList genres={genres} />
      </div>
    </main>
  );
};

export default GenresPage;
