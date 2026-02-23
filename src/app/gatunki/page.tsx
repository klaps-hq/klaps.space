import { Metadata } from "next";
import { getGenres } from "@/lib/genres";
import { SITE_URL } from "@/lib/site-config";
import SectionHeader from "@/components/common/section-header";
import GenresList from "./_components/genres-list";

export const dynamic = "force-dynamic";

const GenresPage = async () => {
  const genres = await getGenres();

  return (
    <main className="bg-black min-h-screen px-8 py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-16">
        <SectionHeader
          prefix="Gatunki"
          title="Gatunki filmowe"
          description="Przeglądaj filmy i seanse specjalne w kinach studyjnych według gatunku."
        />

        <GenresList genres={genres} />
      </div>
    </main>
  );
};

export const metadata: Metadata = {
  title: "Gatunki filmowe",
  description:
    "Lista gatunków filmowych dostępnych w serwisie Klaps. Przeglądaj klasykę, retrospektywy i seanse specjalne według gatunku.",
  alternates: {
    canonical: `${SITE_URL}/gatunki`,
  },
};

export default GenresPage;
