"use client";

import React from "react";
import { motion } from "framer-motion";
import { IMovie } from "@/interfaces/IMovies";
import MoviePoster from "@/components/common/movie-poster";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import MovieTrailer from "./movie-trailer";
import MovieMetaTable from "./movie-meta-table";
import MovieHeroHeader from "./movie-hero-header";
import MovieCredits from "./movie-credits";
import MovieDescription from "./movie-description";
import { fadeIn, useMotion } from "./motion";

interface MovieHeroProps {
  movie: IMovie;
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const MovieHero: React.FC<MovieHeroProps> = ({ movie }) => {
  const { t, variant } = useMotion();

  const breadcrumbItems = [
    { name: "Filmy", href: "/filmy" },
    { name: movie.title },
  ];

  return (
    <motion.div
      className="flex flex-col gap-10 px-8 lg:px-12 xl:px-16 pt-28 md:pt-36 pb-16 md:pb-24"
      initial="hidden"
      animate="visible"
      variants={stagger}
    >
      <motion.div variants={fadeIn} transition={t}>
        <Breadcrumbs items={breadcrumbItems} />
      </motion.div>

      <MovieHeroHeader movie={movie} />

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
          <MovieMetaTable movie={movie} />
        </div>
      </motion.div>

      <MovieCredits movie={movie} />
      <MovieDescription description={movie.description} />

      {movie.videoUrl && (
        <motion.div variants={variant} transition={t}>
          <MovieTrailer videoUrl={movie.videoUrl} />
        </motion.div>
      )}
    </motion.div>
  );
};

export default MovieHero;
