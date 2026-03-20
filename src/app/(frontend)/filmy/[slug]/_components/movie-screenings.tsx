"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { IScreening } from "@/interfaces/IScreenings";
import EmptyState from "@/components/common/empty-state";
import HeaderCitySelect from "@/components/layout/header/header-city-select";

type MovieScreeningsProps = {
  screenings: IScreening[];
};

const formatScreeningDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit" });
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const stagger = {
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const rowStagger = {
  visible: {
    transition: { staggerChildren: 0.04 },
  },
};

const transition = { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] };
const reducedTransition = { duration: 0.15 };

const ScreeningRow: React.FC<{
  screening: IScreening;
  prefersReducedMotion: boolean | null;
}> = ({ screening, prefersReducedMotion }) => {
  const badges = [
    screening.isDubbing && "Dubbing",
    screening.isSubtitled && "Napisy",
  ].filter(Boolean) as string[];

  return (
    <motion.div
      className="grid grid-cols-[60px_50px_1fr] md:grid-cols-[70px_60px_1fr] items-center gap-x-4 md:gap-x-6 py-4 md:py-5 border-b border-white/[0.06]"
      variants={prefersReducedMotion ? fadeIn : fadeUp}
      transition={prefersReducedMotion ? reducedTransition : { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <span className="text-blood-red font-semibold text-sm tabular-nums whitespace-nowrap">
        {formatScreeningDate(screening.date)}
      </span>
      <span className="text-white/70 text-sm tabular-nums">
        {screening.time}
      </span>
      <div className="flex items-center justify-between gap-3 min-w-0">
        <div className="flex flex-col min-w-0">
          <Link
            href={`/miasta/${screening.cinema.city.slug}`}
            className="text-white font-bold text-sm uppercase truncate hover:text-blood-red transition-colors"
          >
            {screening.cinema.city.name}
          </Link>
          <span className="text-neutral-500 text-xs uppercase tracking-wider truncate">
            {screening.cinema.name}
          </span>
        </div>
        {badges.length > 0 && (
          <div className="flex gap-1.5 shrink-0">
            {badges.map((badge) => (
              <span
                key={badge}
                className="text-[10px] uppercase tracking-wider text-neutral-400 border border-white/10 px-2 py-0.5"
              >
                {badge}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const MovieScreenings: React.FC<MovieScreeningsProps> = ({ screenings }) => {
  const prefersReducedMotion = useReducedMotion();
  const sortedScreenings = [...screenings].sort((a, b) =>
    a.dateTime.localeCompare(b.dateTime)
  );

  const t = prefersReducedMotion ? reducedTransition : transition;
  const variant = prefersReducedMotion ? fadeIn : fadeUp;

  return (
    <motion.div
      className="px-8 lg:px-12 xl:px-16 pt-28 md:pt-36 pb-16 md:pb-24 flex flex-col gap-8"
      initial="hidden"
      animate="visible"
      variants={stagger}
    >
      <motion.div className="flex flex-col gap-3" variants={variant} transition={t}>
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
                duration: prefersReducedMotion ? 0.15 : 0.6,
                delay: prefersReducedMotion ? 0 : 0.25,
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

          <motion.div variants={rowStagger} initial="hidden" animate="visible">
            {sortedScreenings.map((screening) => (
              <ScreeningRow
                key={screening.id}
                screening={screening}
                prefersReducedMotion={prefersReducedMotion}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MovieScreenings;
