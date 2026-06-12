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

// Polish typography: single-letter prepositions/conjunctions must not be
// left dangling at the end of a line. Group such a word with the one that
// follows so they never break apart.
const isOrphanWord = (word: string): boolean => word.replace(/\W/g, "").length === 1;

// Bundle each orphan word together with the next word into one group; every
// other word is its own group. Groups are what may wrap; words inside a group
// stay on the same line.
const groupOrphanWords = (words: string[]): string[][] => {
  const groups: string[][] = [];
  for (let i = 0; i < words.length; i += 1) {
    if (isOrphanWord(words[i]) && i < words.length - 1) {
      groups.push([words[i], words[i + 1]]);
      i += 1;
    } else {
      groups.push([words[i]]);
    }
  }
  return groups;
};

export const TitleReveal: React.FC<TitleRevealProps> = ({
  text,
  className,
}) => {
  const groups = groupOrphanWords(text.split(" "));
  return (
    // h2, not h1 - the movie title is random per visit, so the stable
    // sr-only h1 in the hero carries the page's main heading instead.
    <motion.h2 className={className} variants={wordRevealContainer}>
      {groups.map((group, gIdx) => (
        // whitespace-nowrap keeps a grouped orphan glued to its neighbour.
        <span key={gIdx} className="inline-block whitespace-nowrap">
          {group.map((word, i) => (
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
        </span>
      ))}
    </motion.h2>
  );
};

interface CharsRevealSegment {
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
