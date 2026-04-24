import Hero from "./_components/hero";
import Footer from "./_components/footer";
import { getRandomScreening } from "@/lib/screenings";

export const revalidate = 300;

const HomePage = async () => {
  const randomScreening = await getRandomScreening().catch(() => null);

  return (
    <>
      <Hero screening={randomScreening} />
      <Footer />
    </>
  );
};

export default HomePage;
