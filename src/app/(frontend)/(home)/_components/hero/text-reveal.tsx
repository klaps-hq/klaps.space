"use client";

import React from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";

const wordRevealContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05 },
  },
};

const wordRevealItem: Variants = {
  hidden: { y: "110%" },
  visible: {
    y: "0%",
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const charRevealContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.008 },
  },
};

const charRevealItem: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
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
    // h2, not h1 - the movie title is random per visit, so the stable
    // sr-only h1 in the hero carries the page's main heading instead.
    <motion.h2 className={className} variants={wordRevealContainer}>
      {words.map((word, i) => (
        // Top padding + matching negative margin keep the slide-up mask
        // from clipping tall diacritics (Ś, Ć, Ó) without shifting layout.
        <span
          key={`${word}-${i}`}
          className="inline-block overflow-hidden pt-[0.2em] -mt-[0.2em] pb-[0.08em] mr-[0.25em] align-bottom"
        >
          <motion.span className="inline-block" variants={wordRevealItem}>
            {word}
          </motion.span>
        </span>
      ))}
    </motion.h2>
  );
};

export interface CharsRevealSegment {
  text: string;
  href?: string;
}

interface CharsRevealProps {
  segments: CharsRevealSegment[];
  className?: string;
}

// Splits into words so spaces stay as plain text nodes and lines can wrap.
const renderChars = (text: string) =>
  text.split(" ").map((word, wIdx, words) => (
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
  ));

export const CharsReveal: React.FC<CharsRevealProps> = ({
  segments,
  className,
}) => (
  <motion.p className={className} variants={charRevealContainer}>
    {segments.map((segment, sIdx) =>
      segment.href ? (
        <Link
          key={sIdx}
          href={segment.href}
          className="text-white hover:text-white/60 transition-colors"
        >
          {renderChars(segment.text)}
        </Link>
      ) : (
        <React.Fragment key={sIdx}>
          {renderChars(segment.text)}
        </React.Fragment>
      )
    )}
  </motion.p>
);
