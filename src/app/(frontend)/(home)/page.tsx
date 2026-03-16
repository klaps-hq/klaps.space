import { Suspense } from "react";
import Hero from "./_components/hero";
import ScreeningsSection from "./_components/screenings-section";
import ScreeningsSectionLoader from "./_components/screenings-section/screenings-section-loader";
import HowItWorksSection from "./_components/how-it-works-section";
import MissionSection from "./_components/mission-section";
import MultiCitySection from "./_components/multi-city-section";
import StudioCinemasSection from "./_components/studio-cinemas-section";
import SectionDivider from "@/components/ui/section-divider";
import { getCinemas } from "@/lib/cinemas";
import { getMultiCityMovies } from "@/lib/movies";
import { getRandomScreening } from "@/lib/screenings";

export const revalidate = 300;

type SearchParams = {
  city?: string;
  genre?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
};

interface HomeProps {
  searchParams: Promise<SearchParams>;
}

const HomePage = async ({ searchParams }: HomeProps) => {
  const params = await searchParams;

  const [cinemasResult, moviesResult, screeningResult] =
    await Promise.allSettled([
      getCinemas(),
      getMultiCityMovies(),
      getRandomScreening(),
    ]);

  const cinemaGroups =
    cinemasResult.status === "fulfilled" ? cinemasResult.value.data : [];

  const multiCityMovies =
    moviesResult.status === "fulfilled" ? moviesResult.value : [];

  const randomScreening =
    screeningResult.status === "fulfilled" ? screeningResult.value : null;

  return (
    <>
      <Hero screening={randomScreening} />
      <Suspense fallback={<ScreeningsSectionLoader />}>
        <ScreeningsSection searchParams={params} />
      </Suspense>
      <SectionDivider />
      <HowItWorksSection />
      <SectionDivider />
      <MissionSection />
      <SectionDivider />
      <StudioCinemasSection cinemaGroups={cinemaGroups} />
      <SectionDivider />
      <MultiCitySection movies={multiCityMovies} />
    </>
  );
};

export default HomePage;
