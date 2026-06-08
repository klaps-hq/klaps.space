"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

interface HeroParallaxProps {
  backdropSrc: string;
  // Portrait poster shown on mobile, where the wide backdrop would crop to an
  // unflattering center strip. Falls back to the backdrop when absent.
  posterSrc?: string | null;
  alt: string;
  children: React.ReactNode;
}

const HeroParallax: React.FC<HeroParallaxProps> = ({
  backdropSrc,
  posterSrc,
  alt,
  children,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);

  return (
    <div
      ref={ref}
      className="relative w-full h-full rounded-2xl overflow-hidden isolate [clip-path:inset(0_round_1rem)]"
    >
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 1.08 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="absolute inset-0"
          style={{ y: imageY, scale: imageScale }}
        >
          {posterSrc ? (
            <>
              {/* Mobile: portrait poster fills the tall viewport cleanly. */}
              <Image
                src={posterSrc}
                alt={alt}
                fill
                sizes="100vw"
                quality={65}
                className="object-cover md:hidden"
                priority
              />
              {/* Desktop: cinematic landscape backdrop. */}
              <Image
                src={backdropSrc}
                alt={alt}
                fill
                sizes="100vw"
                quality={60}
                className="object-cover hidden md:block"
                priority
              />
            </>
          ) : (
            <Image
              src={backdropSrc}
              alt={alt}
              fill
              sizes="100vw"
              quality={60}
              className="object-cover"
              priority
            />
          )}
        </motion.div>
      </motion.div>

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
