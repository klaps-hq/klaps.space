import React from "react";
import Image from "next/image";
import Link from "next/link";
import { IRandomScreening } from "@/interfaces/IScreenings";
import { tmdbImageUrl } from "@/lib/tmdb";

interface HeroProps {
  screening: IRandomScreening | null;
}

const CTA_PRIMARY = "ZOBACZ SEANSE";
const SCREENINGS_SECTION_ID = "#seanse";

const Hero: React.FC<HeroProps> = ({ screening }) => {
  if (!screening) {
    return null;
  }

  const screeningDate = new Date(screening.screening.dateTime);
  const formattedDate = new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "long",
  }).format(screeningDate);

  return (
    <section className="h-screen w-full bg-black flex items-center">
      <div className="w-full flex flex-col md:flex-row items-center gap-8 px-6 md:px-10 py-8">
        <div className="relative w-full md:w-[55%] h-[40vh] md:h-[65vh] rounded-xl overflow-hidden shrink-0">
          <Image
            src={tmdbImageUrl(screening.movie.backdropUrl ?? "", "w1280")}
            alt={screening.movie.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="flex-1 flex flex-col gap-6 text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase leading-tight">
            {screening.movie.title}
          </h1>

          <p className="text-sm md:text-base text-white/60">
            {formattedDate} · {screening.screening.time} ·{" "}
            {screening.screening.cinema.city.name} ·{" "}
            {screening.screening.cinema.name}
          </p>

          <p className="text-base md:text-lg text-white/80 font-light line-clamp-4 max-w-prose">
            {screening.movie.description}
          </p>

          <Link
            href={SCREENINGS_SECTION_ID}
            className="self-start text-sm text-white border-b border-white/40 pb-0.5 hover:border-white transition-colors"
          >
            {CTA_PRIMARY}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
