import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeader from "@/components/common/section-header";
import { Button } from "@/components/ui/button";
import MultiCityInteractive from "./multi-city-interactive";
import { IMultiCityMovie } from "@/interfaces/IMovies";
import SectionReveal from "@/components/animations/section-reveal";

interface MultiCitySectionProps {
  movies: IMultiCityMovie[];
}

const MultiCitySection: React.FC<MultiCitySectionProps> = ({ movies }) => {
  if (movies.length === 0) return null;

  const sortedMovies = [...movies].sort(
    (a, b) => b.citiesCount - a.citiesCount
  );
  const mostPlayedMovie = sortedMovies[0];

  return (
    <SectionReveal className="bg-black px-8 py-24 md:py-32" delay={0.12}>
      <div className="max-w-[1400px] mx-auto flex flex-col gap-16">
        <SectionHeader
          prefix="W kinach w całej Polsce"
          title="Filmy grane w wielu miastach"
          description="Te filmy wracają do kin w&nbsp;całej Polsce."
        />

        <MultiCityInteractive
          movies={sortedMovies}
          defaultMovie={mostPlayedMovie}
        />

        <Button variant="secondary" size="lg" asChild className="w-fit mx-auto">
          <Link href="/filmy">
            Zobacz wszystkie filmy
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </SectionReveal>
  );
};

export default MultiCitySection;
