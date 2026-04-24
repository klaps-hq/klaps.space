import Hero from "./_components/hero";
import { getRandomScreening } from "@/lib/screenings";

export const revalidate = 300;

const HomePage = async () => {
  const randomScreening = await getRandomScreening().catch(() => null);

  return (
    <>
      <Hero screening={randomScreening} />
      <section className="h-[30vh] w-full" />
    </>
  );
};

export default HomePage;
