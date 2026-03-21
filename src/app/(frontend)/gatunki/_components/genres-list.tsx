"use client";

import React from "react";
import { motion } from "framer-motion";
import { IGenre } from "@/interfaces/IMovies";
import GenreLinkItem from "./genre-link-item";

interface GenresListProps {
  genres: IGenre[];
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.03 } },
};

const item = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};

const GenresList: React.FC<GenresListProps> = ({ genres }) => {
  if (genres.length === 0) {
    return (
      <p className="text-neutral-500 text-base">
        Brak gatunków do wyświetlenia.
      </p>
    );
  }

  const sortedGenres = [...genres].sort((a, b) =>
    a.name.localeCompare(b.name, "pl")
  );

  return (
    <motion.ul
      className="grid grid-cols-1 md:grid-cols-2 gap-x-16 border-t border-white/[0.06]"
      initial="hidden"
      animate="visible"
      variants={stagger}
    >
      {sortedGenres.map((genre) => (
        <motion.li
          key={genre.id}
          variants={item}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <GenreLinkItem genre={genre} />
        </motion.li>
      ))}
    </motion.ul>
  );
};

export default GenresList;
