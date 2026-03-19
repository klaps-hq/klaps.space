"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { tmdbImageUrl } from "@/lib/tmdb";

interface HeroBackdropMotionProps {
  backdropUrl: string;
  movieTitle: string;
}

const HeroBackdropMotion: React.FC<HeroBackdropMotionProps> = ({
  backdropUrl,
  movieTitle,
}) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className="absolute inset-0 z-1 overflow-hidden"
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={
        prefersReducedMotion
          ? { duration: 0.2 }
          : { duration: 1.6, ease: [0.22, 1, 0.36, 1] }
      }
    >
      {/* Ken Burns slow zoom */}
      <motion.div
        className="absolute inset-0"
        animate={prefersReducedMotion ? undefined : { scale: 1.06 }}
        transition={
          prefersReducedMotion
            ? undefined
            : { duration: 20, ease: "linear" }
        }
      >
        <Image
          src={tmdbImageUrl(backdropUrl, "original")}
          alt={`Plakat filmowy: ${movieTitle}`}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </motion.div>

      {/* Bottom gradient — text readability */}
      <motion.div
        className="absolute inset-0 bg-[linear-gradient(to_top,black_0%,rgba(0,0,0,0.88)_22%,rgba(0,0,0,0.35)_52%,rgba(0,0,0,0.08)_75%,transparent_100%)] pointer-events-none"
        aria-hidden="true"
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0.5 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: prefersReducedMotion ? 0.2 : 1.2, ease: "easeOut" }}
      />

      {/* Left gradient — desktop text readability */}
      <motion.div
        className="absolute inset-0 hidden md:block bg-[linear-gradient(to_right,rgba(0,0,0,0.82)_0%,rgba(0,0,0,0.55)_25%,rgba(0,0,0,0.12)_50%,transparent_65%)] pointer-events-none"
        aria-hidden="true"
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0.4 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: prefersReducedMotion ? 0.2 : 1.0, ease: "easeOut" }}
      />

      {/* Cinematic vignette */}
      <div
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,transparent_20%,rgba(0,0,0,0.6)_100%)]"
        aria-hidden="true"
      />

      {/* Subtle blood-red ambient glow on the image */}
      <motion.div
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_50%_40%_at_55%_42%,rgba(220,19,1,0.07)_0%,transparent_70%)]"
        aria-hidden="true"
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={
          prefersReducedMotion
            ? { duration: 0.2 }
            : { duration: 2.5, delay: 0.6, ease: "easeOut" }
        }
      />

      {/* Bottom edge fade to next section */}
      <div
        className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none"
        aria-hidden="true"
      />
    </motion.div>
  );
};

export default HeroBackdropMotion;
