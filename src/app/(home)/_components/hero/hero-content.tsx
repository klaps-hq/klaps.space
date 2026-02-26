"use client";

import React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { IRandomScreening } from "@/interfaces/IScreenings";
import { cn, getTitleSizeClasses } from "@/lib/utils";
import MovieMeta from "./movie-meta";
import HeroScreeningMeta from "./hero-screening-meta";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface HeroContentProps {
  screening: IRandomScreening;
}

const HERO_LABEL_MAIN = "TERAZ W KINIE";
const HERO_LABEL_SUB = "POKAZ RETROSPEKTYWNY";
const CTA_PRIMARY = "ZOBACZ SEANSE";
const CTA_SECONDARY = "SZCZEGÓŁY FILMU";
const SCREENINGS_SECTION_ID = "#seanse";
const TRUST_LINE =
  "Aktualne seanse z kin w całej Polsce. Dane z publicznych źródeł.";

const contentContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const contentItemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const reducedMotionContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const reducedMotionItemVariants: Variants = {
  hidden: { opacity: 0, y: 0 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: "linear",
    },
  },
};

const HeroContent: React.FC<HeroContentProps> = ({ screening }) => {
  const prefersReducedMotion = useReducedMotion();
  const movieDetailsHref = `/filmy/${screening.movie.slug}`;
  const screeningDate = new Date(screening.screening.dateTime);
  const formattedDate = new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "long",
  }).format(screeningDate);

  const containerVariants = prefersReducedMotion
    ? reducedMotionContainerVariants
    : contentContainerVariants;

  const itemVariants = prefersReducedMotion
    ? reducedMotionItemVariants
    : contentItemVariants;

  return (
    <motion.div
      className="z-10 absolute bottom-8 left-4 right-4 md:bottom-auto md:top-1/2 md:left-8 md:right-auto md:-translate-y-1/2 flex flex-col gap-2 md:gap-4"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
      variants={containerVariants}
    >
      <motion.div className="flex flex-col gap-6" variants={itemVariants}>
        <Badge variant="label" suffix={HERO_LABEL_SUB}>
          {HERO_LABEL_MAIN}
        </Badge>

        <HeroScreeningMeta
          formattedDate={formattedDate}
          screeningTime={screening.screening.time}
          cinema={screening.screening.cinema}
          city={screening.screening.cinema.city}
        />

        <h1
          className={cn(
            "font-bold text-white uppercase max-w-[1150px]",
            getTitleSizeClasses(screening.movie.title)
          )}
        >
          <span className="md:bg-black md:pr-4 md:box-decoration-clone md:inline">
            {screening.movie.title}
          </span>
        </h1>
      </motion.div>

      <motion.div className="flex flex-col gap-3" variants={itemVariants}>
        <MovieMeta
          duration={screening.movie.duration}
          productionYear={screening.movie.productionYear}
          genres={screening.movie.genres}
        />

        <p className="text-base md:text-xl lg:text-2xl text-white font-light italic max-w-[650px] line-clamp-3">
          {screening.movie.description}
        </p>

        <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-2">
          <Button asChild variant="primary" size="xl">
            <Link href={SCREENINGS_SECTION_ID}>{CTA_PRIMARY}</Link>
          </Button>

          <Button asChild variant="secondary" size="xl">
            <Link href={movieDetailsHref}>{CTA_SECONDARY}</Link>
          </Button>
        </div>

        <p className="text-xs md:text-sm italic text-[#B3B3B3] max-w-[500px] pt-2 md:pt-4 hidden sm:block">
          {TRUST_LINE}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default HeroContent;
