"use client";

import React, { useRef } from "react";
import { getImageProps } from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

interface HeroParallaxProps {
  backdropSrc: string;
  // Portrait poster shown on mobile, where the wide backdrop would crop to an
  // unflattering center strip. Falls back to the backdrop when absent.
  posterSrc?: string | null;
  // Tiny base64 previews (lib/blur.ts) shown instantly while the full
  // images stream in; without them the placeholder stays empty.
  backdropBlurDataUrl?: string | null;
  posterBlurDataUrl?: string | null;
  alt: string;
  children: React.ReactNode;
}

// Tailwind md breakpoint: below it the portrait poster renders, above it
// the landscape backdrop. Must stay in sync with the blur divs below.
const MOBILE_MEDIA = "(max-width: 767px)";

const HeroParallax: React.FC<HeroParallaxProps> = ({
  backdropSrc,
  posterSrc,
  backdropBlurDataUrl,
  posterBlurDataUrl,
  alt,
  children,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);

  // A single <picture> instead of two CSS-toggled next/image instances:
  // with two priority images the browser downloads both variants on every
  // device (the hidden one included), which doubles the LCP-critical
  // payload. <source media> makes it fetch exactly one.
  // priority: the hero art is the LCP element; without it getImageProps
  // emits loading="lazy".
  const { props: backdropProps } = getImageProps({
    src: backdropSrc,
    alt,
    fill: true,
    sizes: "100vw",
    priority: true,
  });
  const posterImageProps = posterSrc
    ? getImageProps({
        src: posterSrc,
        alt,
        fill: true,
        sizes: "100vw",
        priority: true,
      }).props
    : null;

  return (
    <div
      ref={ref}
      className="relative w-full h-full rounded-2xl overflow-hidden isolate [clip-path:inset(0_round_1rem)]"
    >
      {/* No JS-driven entrance on the artwork: the hero image is the LCP
          element, and a framer initial opacity-0 keeps it invisible until
          hydration, which costs seconds of LCP on throttled mobile. The
          blur placeholder already provides the "appearing" feel; text and
          nav reveals (framer) stay untouched. */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          style={{ y: imageY, scale: imageScale }}
        >
          {/* Blur previews live behind the <img> so each breakpoint gets its
              own placeholder (a single img can only carry one blur style).
              blur + scale turns the tiny base64 preview into a smooth wash
              instead of an upscaled pixel grid; scale-125 pushes the soft
              edges of the filter past the (overflow-hidden) frame. */}
          {posterImageProps && posterBlurDataUrl && (
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-cover bg-center blur-2xl scale-125 md:hidden"
              style={{ backgroundImage: `url(${posterBlurDataUrl})` }}
            />
          )}
          {backdropBlurDataUrl && (
            <div
              aria-hidden="true"
              className={`absolute inset-0 bg-cover bg-center blur-2xl scale-125 ${
                posterImageProps ? "hidden md:block" : ""
              }`}
              style={{ backgroundImage: `url(${backdropBlurDataUrl})` }}
            />
          )}
          {/* Slow, continuous ken-burns drift on the artwork. It starts at
              scale 1 (no opacity:0 / no initial), so the LCP hero image is
              painted at full size from the first frame; the motion only adds
              a gentle zoom afterwards. Skipped for prefers-reduced-motion. */}
          <motion.div
            className="absolute inset-0"
            animate={
              prefersReducedMotion ? undefined : { scale: [1, 1.08], y: ["0%", "-2.5%"] }
            }
            transition={
              prefersReducedMotion
                ? undefined
                : {
                    duration: 24,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "reverse",
                  }
            }
          >
            <picture>
              {posterImageProps && (
                <source
                  media={MOBILE_MEDIA}
                  srcSet={posterImageProps.srcSet}
                  sizes="100vw"
                />
              )}
              {/* Raw img on purpose: props come from getImageProps, so the
                  optimizer pipeline still applies (alt included via spread).
                  Explicit fetchPriority: getImageProps does not forward it,
                  and Lighthouse flags the LCP image without the hint. */}
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <img
                {...backdropProps}
                fetchPriority="high"
                className="object-cover"
              />
            </picture>
          </motion.div>
        </motion.div>
      </div>

      <div className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-soft-light">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <filter id="hero-grain-filter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#hero-grain-filter)" />
        </svg>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black from-[6%] via-black/50 via-50% to-black/30" />

      <motion.div className="absolute inset-0 z-[4]" style={{ y: contentY }}>
        {children}
      </motion.div>
    </div>
  );
};

export default HeroParallax;
