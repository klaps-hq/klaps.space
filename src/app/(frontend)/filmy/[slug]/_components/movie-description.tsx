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
      <h2 className="text-white text-lg md:text-xl font-bold uppercase tracking-wide">
        O filmie
      </h2>

      <div className="flex flex-col gap-4 mt-2 border-l-2 border-blood-red/40 pl-4">
        {paragraphs.map((paragraph, i) => (
          <p
            key={i}
            className="text-white/90 text-base md:text-lg leading-relaxed"
          >
            {paragraph}
          </p>
        ))}
      </div>
    </motion.div>
  );
};

export default MovieDescription;
