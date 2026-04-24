"use client";

import React from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { IRandomScreening } from "@/interfaces/IScreenings";
import { tmdbImageUrl } from "@/lib/tmdb";
import { formatDuration } from "@/lib/utils";
import HeroParallax from "./hero-parallax";
import { CharsReveal, TitleReveal } from "./text-reveal";

interface HeroProps {
  screening: IRandomScreening | null;
}

const CTA_PRIMARY = "ZOBACZ SEANSE";
const SCREENINGS_SECTION_ID = "#seanse";

const navVariants: Variants = {
  hidden: { opacity: 0, y: -16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
};

const contentContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.6,
    },
  },
};

const contentItemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

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
      <HeroParallax
        backdropSrc={tmdbImageUrl(screening.movie.backdropUrl ?? "", "original")}
        alt={screening.movie.title}
      >
        <motion.nav
          className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 md:px-12 lg:px-16 py-6"
          variants={navVariants}
          initial="hidden"
          animate="visible"
        >
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
        </motion.nav>

        <motion.div
          className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 lg:p-16"
          variants={contentContainerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-12">
            <div className="flex flex-col gap-6 md:flex-1 md:min-w-0">
              <CharsReveal
                text={`${formattedDate} · ${screening.screening.time} · ${screening.screening.cinema.name} · ${screening.screening.cinema.city.name}`}
                className="text-xs md:text-sm uppercase tracking-[0.2em] text-white/70"
              />

              <TitleReveal
                text={screening.movie.title}
                className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase text-white leading-[0.95]"
              />

              <motion.div
                variants={contentItemVariants}
                className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/60"
              >
                {screening.movie.duration && (
                  <span>{formatDuration(screening.movie.duration)}</span>
                )}
                {screening.movie.duration &&
                  screening.movie.productionYear && <span>&middot;</span>}
                {screening.movie.productionYear && (
                  <span>{screening.movie.productionYear}</span>
                )}
                {screening.movie.productionYear &&
                  screening.movie.genres.length > 0 && <span>&middot;</span>}
                {screening.movie.genres.length > 0 && (
                  <span className="uppercase tracking-wider">
                    {screening.movie.genres
                      .slice(0, 2)
                      .map((g) => g.name)
                      .join(" / ")}
                  </span>
                )}
              </motion.div>
            </div>

            <div className="flex flex-col gap-5 md:w-xl md:shrink-0">
              <motion.p
                variants={contentItemVariants}
                className="text-base md:text-lg text-white/85 font-light line-clamp-4"
              >
                {screening.movie.description}
              </motion.p>
              <motion.div
                variants={contentItemVariants}
                className="self-start"
              >
                <Link
                  href={SCREENINGS_SECTION_ID}
                  className="text-base text-white border-b border-white/50 pb-0.5 hover:border-white transition-colors"
                >
                  {CTA_PRIMARY}
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </HeroParallax>
    </section>
  );
};

export default Hero;
