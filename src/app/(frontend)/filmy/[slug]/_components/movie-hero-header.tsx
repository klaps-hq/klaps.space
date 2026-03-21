import React from "react";
import { motion } from "framer-motion";
import { IMovie } from "@/interfaces/IMovies";
import { cn, formatNames, getTitleSizeClasses } from "@/lib/utils";
import { useMotion } from "./motion";

interface MovieHeroHeaderProps {
  movie: IMovie;
}

const MovieHeroHeader: React.FC<MovieHeroHeaderProps> = ({ movie }) => {
  const { reduced, variant, t } = useMotion();
  const directors = formatNames(movie.directors);

  return (
    <motion.div
      className="flex flex-col gap-4"
      variants={variant}
      transition={t}
    >
      <h1
        className={cn(
          getTitleSizeClasses(movie.title),
          "text-white font-black uppercase tracking-tight leading-none md:leading-none",
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
        transition={{
          duration: reduced ? 0.15 : 0.6,
          delay: reduced ? 0 : 0.3,
          ease: [0.25, 0.1, 0.25, 1],
        }}
      />
    </motion.div>
  );
};

export default MovieHeroHeader;
