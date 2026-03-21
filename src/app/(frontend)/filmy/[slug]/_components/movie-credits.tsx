import React from "react";
import { motion } from "framer-motion";
import { IMovie } from "@/interfaces/IMovies";
import { formatNames } from "@/lib/utils";
import { useMotion } from "./motion";

interface MovieCreditsProps {
  movie: IMovie;
}

const MovieCredits: React.FC<MovieCreditsProps> = ({ movie }) => {
  const { variant, t } = useMotion();

  const items = [
    { label: "Obsada", value: formatNames(movie.actors) },
    {
      label: "Scenariusz",
      value: formatNames(movie.scriptwriters ?? movie.screenwriters),
    },
  ].filter((item) => item.value) as { label: string; value: string }[];

  if (items.length === 0) return null;

  return (
    <motion.div
      className="flex flex-col gap-4"
      variants={variant}
      transition={t}
    >
      {items.map((item) => (
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
  );
};

export default MovieCredits;
