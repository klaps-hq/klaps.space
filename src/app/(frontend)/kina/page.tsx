import { getCinemas } from "@/lib/cinemas";
import CinemasHeader from "./_components/cinemas-header";
import CinemasList from "./_components/cinemas-list";

export const revalidate = 300;

const CinemasPage = async () => {
  const { data: cinemaGroups } = await getCinemas({ limit: 1000 });

  const sortedGroups = [...cinemaGroups].sort((a, b) =>
    a.city.name.localeCompare(b.city.name, "pl"),
  );

  return (
    <main className="bg-black min-h-screen px-8 lg:px-12 xl:px-16 pt-28 md:pt-36 pb-16 md:pb-24">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-12">
        <CinemasHeader />
        <CinemasList cinemaGroups={sortedGroups} />
      </div>
    </main>
  );
};

export default CinemasPage;
