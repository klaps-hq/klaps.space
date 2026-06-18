import React from "react";
import Link from "next/link";

// Per-word / per-char entrance reveals in pure CSS (see globals.css .kx-*).
// The text renders visible in the SSR HTML and stays visible without JS or
// under reduced motion; framer-motion would bake inline opacity:0 into the
// markup, hiding the hero until hydration. Stagger is an inline
// animation-delay, which only matters once the animation actually plays.

const WORD_STAGGER_MS = 50;
const CHAR_STAGGER_MS = 8;

interface TitleRevealProps {
  text: string;
  className?: string;
}

// Polish typography: single-letter prepositions/conjunctions must not be
// left dangling at the end of a line. Group such a word with the one that
// follows so they never break apart.
const isOrphanWord = (word: string): boolean =>
  word.replace(/\W/g, "").length === 1;

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
  // Global index of each group's first word, computed without mutating any
  // outer variable during render (the React Compiler forbids that).
  const groupStart = groups.map((_, gIdx) =>
    groups.slice(0, gIdx).reduce((sum, g) => sum + g.length, 0)
  );
  return (
    // h2, not h1 - the movie title is random per visit, so the stable
    // sr-only h1 in the hero carries the page's main heading instead.
    <h2 className={className}>
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
              <span
                className="kx-rise inline-block"
                style={{
                  animationDelay: `${(groupStart[gIdx] + i) * WORD_STAGGER_MS}ms`,
                }}
              >
                {word}
              </span>
            </span>
          ))}
        </span>
      ))}
    </h2>
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
// baseIndex offsets the per-char stagger so it stays continuous across
// segments without mutating a shared counter during render.
const renderChars = (text: string, baseIndex: number) => {
  const words = text.split(" ");
  const wordOffset = words.map((_, wIdx) =>
    words.slice(0, wIdx).reduce((sum, w) => sum + w.length, 0)
  );
  return words.map((word, wIdx, all) => (
    <React.Fragment key={wIdx}>
      {word.split("").map((char, cIdx) => (
        <span
          key={cIdx}
          className="kx-fade inline-block"
          style={{
            animationDelay: `${(baseIndex + wordOffset[wIdx] + cIdx) * CHAR_STAGGER_MS}ms`,
          }}
        >
          {char}
        </span>
      ))}
      {wIdx < all.length - 1 && " "}
    </React.Fragment>
  ));
};

export const CharsReveal: React.FC<CharsRevealProps> = ({
  segments,
  className,
}) => {
  // First animated-char index of each segment (spaces are not animated).
  const segmentStart = segments.map((_, sIdx) =>
    segments
      .slice(0, sIdx)
      .reduce((sum, s) => sum + s.text.replace(/\s/g, "").length, 0)
  );
  return (
    <p className={className}>
      {segments.map((segment, sIdx) =>
        segment.href ? (
          <Link
            key={sIdx}
            href={segment.href}
            className="text-white hover:text-white/60 transition-colors"
          >
            {renderChars(segment.text, segmentStart[sIdx])}
          </Link>
        ) : (
          <React.Fragment key={sIdx}>
            {renderChars(segment.text, segmentStart[sIdx])}
          </React.Fragment>
        )
      )}
    </p>
  );
};
