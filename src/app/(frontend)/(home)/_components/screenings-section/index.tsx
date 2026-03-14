import React from "react";
import ScreeningsSectionContent from "./screenings-section-content";
import { getScreenings } from "@/lib/screenings";
import { getGenres } from "@/lib/genres";
import { getPreferredCityId } from "@/lib/get-preferred-city";
import SectionReveal from "@/components/animations/section-reveal";

interface ScreeningsSectionProps {
  searchParams?: {
    city?: string;
    genre?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
  };
}

const ScreeningsSection = async ({ searchParams }: ScreeningsSectionProps) => {
  const params = await searchParams;
  const cityId = await getPreferredCityId(params);

  const [screenings, genres] = await Promise.all([
    getScreenings({
      cityId,
      genreId: params?.genre,
      dateFrom: params?.dateFrom,
      dateTo: params?.dateTo,
      search: params?.search,
    }),
    getGenres(),
  ]);

  return (
    <SectionReveal
      id="seanse"
      className="bg-black px-8 py-16 min-h-screen"
      delay={0.04}
    >
      <div className="max-w-[1400px] mx-auto">
        <ScreeningsSectionContent screenings={screenings} genres={genres} />
      </div>
    </SectionReveal>
  );
};

export default ScreeningsSection;
