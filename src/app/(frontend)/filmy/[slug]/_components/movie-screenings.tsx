"use client";

import React from "react";
import { motion } from "framer-motion";
import { IScreening } from "@/interfaces/IScreenings";
import EmptyState from "@/components/common/empty-state";
import HeaderCitySelect from "@/components/layout/header/header-city-select";
import ScreeningRow from "./screening-row";
import { fadeIn, useMotion } from "./motion";

type MovieScreeningsProps = {
  screenings: IScreening[];
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

const MovieScreenings: React.FC<MovieScreeningsProps> = ({ screenings }) => {
  const { reduced, t, variant } = useMotion();
  const sortedScreenings = [...screenings].sort((a, b) =>
    a.dateTime.localeCompare(b.dateTime),
  );

  return (
    <motion.div
      className="px-8 lg:px-12 xl:px-16 pt-28 md:pt-36 pb-16 md:pb-24 flex flex-col gap-8"
      initial="hidden"
      animate="visible"
      variants={stagger}
    >
      <motion.div
        className="flex flex-col gap-3"
        variants={variant}
        transition={t}
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex flex-col gap-2">
            <h2 className="text-white text-3xl md:text-4xl font-black uppercase tracking-tight">
              Nadchodzące seanse
            </h2>
            <motion.div
              className="h-0.5 bg-blood-red"
              initial={{ width: 0 }}
              animate={{ width: 32 }}
              transition={{
                duration: reduced ? 0.15 : 0.6,
                delay: reduced ? 0 : 0.25,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            />
          </div>
          <HeaderCitySelect size="md" />
        </div>

        <p className="text-neutral-500 text-xs uppercase tracking-[0.12em]">
          Wybierz lokalizację i zarezerwuj miejsce
        </p>
      </motion.div>

      {sortedScreenings.length === 0 ? (
        <motion.div variants={fadeIn} transition={t}>
          <EmptyState
            headline="Brak nadchodzących seansów"
            description="Aktualnie nie ma zaplanowanych seansów dla tego filmu."
          />
        </motion.div>
      ) : (
        <motion.div className="w-full" variants={variant} transition={t}>
          <div className="grid grid-cols-[60px_50px_1fr] md:grid-cols-[70px_60px_1fr] gap-x-4 md:gap-x-6 pb-2 border-b border-white/10 text-[11px] uppercase tracking-[0.12em] text-neutral-500">
            <span>Data</span>
            <span>Godz.</span>
            <span>Miasto / Kino</span>
          </div>

          <div>
            {sortedScreenings.map((screening) => (
              <ScreeningRow key={screening.id} screening={screening} />
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MovieScreenings;
