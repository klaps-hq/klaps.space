import { getCities } from "@/lib/cities";
import CitiesHeader from "./_components/cities-header";
import CitiesList from "./_components/cities-list";

export const revalidate = 300;

const CitiesPage = async () => {
  const cities = await getCities();

  return (
    <main className="bg-black min-h-screen px-8 lg:px-12 xl:px-16 pt-28 md:pt-36 pb-16 md:pb-24">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-12">
        <CitiesHeader />
        <CitiesList cities={cities} />
      </div>
    </main>
  );
};

export default CitiesPage;
