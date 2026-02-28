import Hero from "./_components/hero";
import HowItWorksSection from "./_components/how-it-works-section";
import MissionSection from "./_components/mission-section";
import MultiCitySection from "./_components/multi-city-section";
import StudioCinemasSection from "./_components/studio-cinemas-section";
import SectionDivider from "@/components/ui/section-divider";
import { getCinemas } from "@/lib/cinemas";
import { getMultiCityMovies } from "@/lib/movies";
import { getRandomScreening } from "@/lib/screenings";

export const revalidate = 300;

export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [cinemasResult, moviesResult] = await Promise.allSettled([
    getCinemas({ limit: 16 }),
    getMultiCityMovies({ limit: 8 }),
  ]);

  const cinemasResponse =
    cinemasResult.status === "fulfilled"
      ? cinemasResult.value
      : { data: [] as Awaited<ReturnType<typeof getCinemas>>["data"] };

  const multiCityMovies =
    moviesResult.status === "fulfilled" ? moviesResult.value : [];

  let randomScreening = null;
  try {
    randomScreening = await getRandomScreening();
  } catch (error) {
    console.warn("Random screening unavailable, skipping hero section:", error);
  }

  return (
    <>
      <Hero screening={randomScreening} />
      {children}
      <SectionDivider />
      <HowItWorksSection />
      <SectionDivider />
      <MissionSection />
      <SectionDivider />
      <StudioCinemasSection cinemaGroups={cinemasResponse.data} />
      <SectionDivider />
      <MultiCitySection movies={multiCityMovies} />
    </>
  );
}
