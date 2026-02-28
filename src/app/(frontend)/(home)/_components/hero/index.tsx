import React from "react";
import HeroContent from "./hero-content";
import HeroBackdropMotion from "./hero-backdrop-motion";
import { IRandomScreening } from "@/interfaces/IScreenings";
import SectionReveal from "@/components/animations/section-reveal";

interface HeroProps {
  screening: IRandomScreening | null;
}

const Hero: React.FC<HeroProps> = async ({ screening }) => {
  if (!screening) {
    return null;
  }

  const movieTitle = screening.movie.title;

  return (
    <SectionReveal className="flex flex-col items-center justify-center min-h-screen w-full bg-black relative overflow-hidden">
      <HeroContent screening={screening} />
      <HeroBackdropMotion
        backdropUrl={screening.movie.backdropUrl ?? ""}
        movieTitle={movieTitle}
      />
    </SectionReveal>
  );
};

export default Hero;
