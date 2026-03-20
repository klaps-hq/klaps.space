"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { IMovie } from "@/interfaces/IMovies";
import {
  cn,
  formatNames,
  formatDuration,
  formatDatePL,
  getTitleSizeClasses,
} from "@/lib/utils";
import MoviePoster from "@/components/common/movie-poster";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import MovieTrailer from "./movie-trailer";

type MovieHeroProps = {
  movie: IMovie;
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
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const transition = { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] };
const reducedTransition = { duration: 0.15 };

const MovieHero: React.FC<MovieHeroProps> = ({ movie }) => {
  const prefersReducedMotion = useReducedMotion();
  const directors = formatNames(movie.directors);
  const actors = formatNames(movie.actors);
  const scriptwriters = formatNames(
    movie.scriptwriters ?? movie.screenwriters
  );
  const countries = formatNames(movie.countries ?? movie.countryOfOrigin);
  const metaItems = [
    { label: "Rok", value: movie.productionYear.toString() },
    countries && { label: "Kraj", value: countries },
    movie.duration && {
      label: "Czas",
      value: formatDuration(movie.duration),
    },
    movie.language && { label: "Język", value: movie.language },
    movie.worldPremiereDate && {
      label: "Premiera światowa",
      value: formatDatePL(movie.worldPremiereDate),
    },
    movie.polishPremiereDate && {
      label: "Premiera w Polsce",
      value: formatDatePL(movie.polishPremiereDate),
    },
  ].filter(Boolean) as { label: string; value: string }[];

  const creditItems = [
    actors && { label: "Obsada", value: actors },
    scriptwriters && { label: "Scenariusz", value: scriptwriters },
  ].filter(Boolean) as { label: string; value: string }[];

  const t = prefersReducedMotion ? reducedTransition : transition;
  const variant = prefersReducedMotion ? fadeIn : fadeUp;

  return (
    <motion.div
      className="flex flex-col gap-10 px-8 lg:px-12 xl:px-16 pt-28 md:pt-36 pb-16 md:pb-24"
      initial="hidden"
      animate="visible"
      variants={stagger}
    >
      <motion.div variants={fadeIn} transition={t}>
        <Breadcrumbs
          items={[
            { name: "Filmy", href: "/filmy" },
            { name: movie.title },
          ]}
        />
      </motion.div>

      <motion.div className="flex flex-col gap-4" variants={variant} transition={t}>
        <h1
          className={cn(
            getTitleSizeClasses(movie.title),
            "text-white font-black uppercase tracking-tight leading-none md:leading-none"
          )}
        >
          {movie.title}
        </h1>

        {directors && (
          <p className="text-neutral-300 text-lg md:text-2xl uppercase tracking-[0.1em] font-medium">
            Reżyser:{" "}
            <span className="text-blood-red font-semibold">{directors}</span>
          </p>
        )}

        <motion.div
          className="h-0.5 bg-blood-red mt-2"
          initial={{ width: 0 }}
          animate={{ width: 40 }}
          transition={{ duration: prefersReducedMotion ? 0.15 : 0.6, delay: prefersReducedMotion ? 0 : 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        />
      </motion.div>

      <motion.div
        className="flex flex-col md:flex-row gap-8 md:items-stretch"
        variants={variant}
        transition={t}
      >
        {movie.posterUrl && (
          <div className="w-[180px] shrink-0 max-w-[180px] mx-auto md:mx-0">
            <div className="h-full overflow-hidden border border-white/10">
              <MoviePoster
                posterUrl={movie.posterUrl}
                title={movie.title}
                width={180}
                height={420}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        <div className="flex flex-col flex-1 min-w-0">
          {metaItems.length > 0 && (
            <div className="border-t border-white/10 h-full flex flex-col">
              {metaItems.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between py-3 border-b border-white/10 text-xs md:text-sm uppercase tracking-[0.12em]"
                >
                  <span className="text-neutral-500">{item.label}</span>
                  <span className="text-white font-semibold">{item.value}</span>
                </div>
              ))}
              {movie.genres.length > 0 && (
                <div className="flex items-center justify-between py-3 border-b border-white/10 text-xs md:text-sm uppercase tracking-[0.12em]">
                  <span className="text-neutral-500">Gatunek</span>
                  <div className="flex flex-wrap gap-x-1.5 justify-end">
                    {movie.genres.map((genre, i) => (
                      <span key={genre.id}>
                        <Link
                          href={`/gatunki/${genre.slug}`}
                          className="text-white font-semibold hover:text-blood-red transition-colors"
                        >
                          {genre.name}
                        </Link>
                        {i < movie.genres.length - 1 && (
                          <span className="text-neutral-500 ml-1">/</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {creditItems.length > 0 && (
        <motion.div className="flex flex-col gap-4" variants={variant} transition={t}>
          {creditItems.map((item) => (
            <div key={item.label} className="flex flex-col gap-1">
              <span className="text-neutral-500 text-xs uppercase tracking-[0.12em]">
                {item.label}
              </span>
              <span className="text-neutral-300 text-sm md:text-base leading-relaxed">
                {item.value}
              </span>
            </div>
          ))}
        </motion.div>
      )}

      {movie.description && (
        <motion.div className="flex flex-col gap-1" variants={variant} transition={t}>
          <span className="text-neutral-500 text-xs uppercase tracking-[0.12em]">
            Opis
          </span>
          <div className="flex flex-col gap-4 mt-2">
            {movie.description
              .split(/\n\n+/)
              .filter(Boolean)
              .map((paragraph, i) => (
                <p
                  key={i}
                  className="text-neutral-300 text-sm md:text-base leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
          </div>
        </motion.div>
      )}

      {movie.videoUrl && (
        <motion.div variants={variant} transition={t}>
          <MovieTrailer videoUrl={movie.videoUrl} />
        </motion.div>
      )}
    </motion.div>
  );
};

export default MovieHero;
