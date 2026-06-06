import { Suspense } from "react";
import { Metadata } from "next";
import SiteHeader from "@/components/common/site-header";
import Hero from "./_components/hero";
import Footer from "./_components/footer";
import Screenings from "./_components/screenings";
import ScreeningsLoader from "./_components/screenings/loader";
import Genres from "./_components/genres";
import Cinemas from "./_components/cinemas";
import { getRandomScreening } from "@/lib/screenings";
import { NOINDEX_FOLLOW, hasFilterParams } from "@/lib/seo";

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

export const generateMetadata = async ({
  searchParams,
}: HomePageProps): Promise<Metadata> => {
  const params = await searchParams;
  // Only real filter params trigger noindex; unknown params (utm_* etc.)
  // keep the layout-level canonical and stay indexable.
  if (!hasFilterParams(params)) return {};
  // Filtered home: noindex and drop the layout-level canonical
  // to avoid sending mixed signals.
  return { ...NOINDEX_FOLLOW, alternates: { canonical: null } };
};

const HomePage = async ({ searchParams }: HomePageProps) => {
  const params = await searchParams;
  const randomScreening = await getRandomScreening().catch(() => null);

  return (
    <>
      {/* Hidden at the top (the hero carries its own nav), revealed as a
          floating glass bar while scrolling back up. */}
      <SiteHeader overlay />
      <Hero screening={randomScreening} />
      <Suspense fallback={<ScreeningsLoader />}>
        <Screenings searchParams={params} />
      </Suspense>
      <Genres />
      <Cinemas />
      <Footer />
    </>
  );
};

export default HomePage;
