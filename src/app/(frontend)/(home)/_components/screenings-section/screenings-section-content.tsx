"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { IScreeningGroup } from "@/interfaces/IScreenings";
import { IGenre } from "@/interfaces/IMovies";
import {
  ScreeningsTransitionProvider,
  useScreeningsTransition,
} from "@/contexts/screenings-transition-context";
import { cn } from "@/lib/utils";
import ScreeningsSectionHeader from "./screenings-section-header";
import ScreeningsSectionCta from "./screenings-section-cta";
import MoviesGrid from "@/app/filmy/_components/movies-grid";
import {
  reducedMotionStaggerContainerVariants,
  reducedMotionStaggerItemVariants,
  staggerContainerVariants,
  staggerItemVariants,
} from "@/components/animations/motion-presets";

const ITEMS_PER_PAGE = 12;

interface ScreeningsSectionContentProps {
  screenings: IScreeningGroup[];
  genres: IGenre[];
}

const ScreeningsSectionContentInner: React.FC<
  ScreeningsSectionContentProps
> = ({ screenings, genres }) => {
  const { isPending } = useScreeningsTransition();
  const prefersReducedMotion = useReducedMotion();

  const movies = screenings.map((screening) => screening.movie);

  const containerVariants = prefersReducedMotion
    ? reducedMotionStaggerContainerVariants
    : staggerContainerVariants;

  const itemVariants = prefersReducedMotion
    ? reducedMotionStaggerItemVariants
    : staggerItemVariants;

  return (
    <div
      className={cn(
        "flex flex-col gap-10 transition-opacity duration-200",
        isPending && "opacity-50 pointer-events-none"
      )}
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
        className="flex flex-col gap-10"
      >
        <motion.div variants={itemVariants}>
          <ScreeningsSectionHeader genres={genres} />
        </motion.div>

        <motion.div variants={itemVariants}>
          <MoviesGrid
            screenings={screenings}
            movies={movies}
            showDescription={true}
          />
        </motion.div>

        {screenings.length >= ITEMS_PER_PAGE && (
          <motion.div variants={itemVariants} className="mx-auto">
            <ScreeningsSectionCta />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

const ScreeningsSectionContent: React.FC<ScreeningsSectionContentProps> = (
  props
) => (
  <ScreeningsTransitionProvider>
    <ScreeningsSectionContentInner {...props} />
  </ScreeningsTransitionProvider>
);

export default ScreeningsSectionContent;
