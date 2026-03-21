import React from "react";
import { motion } from "framer-motion";
import { useMotion } from "./motion";

interface MovieDescriptionProps {
  description: string | null;
}

const MovieDescription: React.FC<MovieDescriptionProps> = ({ description }) => {
  const { variant, t } = useMotion();

  if (!description) return null;

  const paragraphs = description.split(/\n\n+/).filter(Boolean);

  return (
    <motion.div
      className="flex flex-col gap-1"
      variants={variant}
      transition={t}
    >
      <span className="text-neutral-500 text-xs uppercase tracking-[0.12em]">
        Opis
      </span>

      <div className="flex flex-col gap-4 mt-2">
        {paragraphs.map((paragraph, i) => (
          <p
            key={i}
            className="text-neutral-300 text-sm md:text-base leading-relaxed"
          >
            {paragraph}
          </p>
        ))}
      </div>
    </motion.div>
  );
};

export default MovieDescription;
