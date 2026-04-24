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
    <section className="h-screen w-full bg-black flex items-center justify-center p-4 md:p-8">
      <div className="relative w-full h-full rounded-2xl overflow-hidden">
        <Image
          src={tmdbImageUrl(screening.movie.backdropUrl ?? "", "original")}
          alt={screening.movie.title}
          fill
          sizes="100vw"
          className="object-cover"
          priority
          quality={95}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30" />

        <nav className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 md:px-12 lg:px-16 py-6">
          <Link href="/" className="flex items-center gap-2.5 text-white">
            <svg
              viewBox="0 0 28 20"
              className="w-5 h-5"
              fill="currentColor"
              aria-hidden="true"
            >
              <polygon points="0,8 28,0 28,20 0,12" />
            </svg>
            <span className="text-xl font-medium lowercase tracking-tight">
              klaps
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/80">
            <Link href="/filmy" className="hover:text-white transition-colors">
              Filmy
            </Link>
            <Link href="/kina" className="hover:text-white transition-colors">
              Kina
            </Link>
            <Link href="/miasta" className="hover:text-white transition-colors">
              Miasta
            </Link>
            <Link href="/seanse" className="hover:text-white transition-colors">
              Seanse
            </Link>
          </div>
        </nav>

        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 lg:p-16">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-12">
            <div className="flex flex-col gap-6 md:flex-1 md:min-w-0">
              <p className="text-xs md:text-sm uppercase tracking-[0.2em] text-white/70">
                {formattedDate} &middot; {screening.screening.time} &middot;{" "}
                {screening.screening.cinema.city.name}
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase text-white leading-[0.95] break-words">
                {screening.movie.title}
              </h1>
            </div>

            <div className="flex flex-col gap-5 md:w-xl md:shrink-0">
              <p className="text-base md:text-lg text-white/85 font-light line-clamp-4">
                {screening.movie.description}
              </p>
              <Link
                href={SCREENINGS_SECTION_ID}
                className="self-start text-base text-white border-b border-white/50 pb-0.5 hover:border-white transition-colors"
              >
                {CTA_PRIMARY}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
