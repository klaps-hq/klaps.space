import { Suspense } from "react";
import Hero from "./_components/hero";
import Footer from "./_components/footer";
import Screenings from "./_components/screenings";
import ScreeningsLoader from "./_components/screenings/loader";
import Genres from "./_components/genres";
import Cinemas from "./_components/cinemas";
import MapTeaser from "./_components/map-teaser";
import { getRandomScreening } from "@/lib/screenings";

export const revalidate = 300;

interface HomePageSearchParams {
  city?: string;
  genres?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

interface HomePageProps {
  searchParams: Promise<HomePageSearchParams>;
}

const HomePage = async ({ searchParams }: HomePageProps) => {
  const params = await searchParams;
  const randomScreening = await getRandomScreening().catch(() => null);

  return (
    <>
      <Hero screening={randomScreening} />
      <Suspense fallback={<ScreeningsLoader />}>
        <Screenings searchParams={params} />
      </Suspense>
      <Genres />
      <Cinemas />
      <MapTeaser />
      <Footer />
    </>
  );
};

export default HomePage;
