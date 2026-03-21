import { getGenres } from "@/lib/genres";
import GenresHeader from "./_components/genres-header";
import GenresList from "./_components/genres-list";

export const revalidate = 300;

const GenresPage = async () => {
  const genres = await getGenres();

  return (
    <main className="bg-black min-h-screen px-8 lg:px-12 xl:px-16 pt-28 md:pt-36 pb-16 md:pb-24">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-12">
        <GenresHeader />
        <GenresList genres={genres} />
      </div>
    </main>
  );
};

export default GenresPage;
