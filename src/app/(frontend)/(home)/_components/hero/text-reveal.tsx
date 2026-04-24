"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";

const wordRevealContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const wordRevealItem: Variants = {
  hidden: { y: "110%" },
  visible: {
    y: "0%",
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

const charRevealContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.015 },
  },
};

const charRevealItem: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

interface TitleRevealProps {
  text: string;
  className?: string;
}

export const TitleReveal: React.FC<TitleRevealProps> = ({
  text,
  className,
}) => {
  const words = text.split(" ");
  return (
    <motion.h1 className={className} variants={wordRevealContainer}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-block overflow-hidden pb-[0.08em] mr-[0.25em] align-bottom"
        >
          <motion.span className="inline-block" variants={wordRevealItem}>
            {word}
          </motion.span>
        </span>
      ))}
    </motion.h1>
  );
};

interface CharsRevealProps {
  text: string;
  className?: string;
}

export const CharsReveal: React.FC<CharsRevealProps> = ({
  text,
  className,
}) => {
  const words = text.split(" ");
  return (
    <motion.p className={className} variants={charRevealContainer}>
      {words.map((word, wIdx) => (
        <React.Fragment key={wIdx}>
          {word.split("").map((char, cIdx) => (
            <motion.span
              key={cIdx}
              className="inline-block"
              variants={charRevealItem}
            >
              {char}
            </motion.span>
          ))}
          {wIdx < words.length - 1 && " "}
        </React.Fragment>
      ))}
    </motion.p>
  );
};
