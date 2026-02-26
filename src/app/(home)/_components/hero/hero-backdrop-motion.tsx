"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

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
      className="absolute inset-0 z-1"
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0.35, scale: 1.08 }}
      whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={
        prefersReducedMotion
          ? { duration: 0.2 }
          : { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
      }
    >
      <Image
        src={backdropUrl}
        alt={`Plakat filmowy: ${movieTitle}`}
        width={1920}
        height={1080}
        className="w-full h-full object-cover md:absolute md:right-0 md:top-0 md:w-[56%] md:max-w-none md:[-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_18%,black_100%)] md:mask-[linear-gradient(to_right,transparent_0%,black_18%,black_100%)]"
        priority
      />
      <motion.div
        className="absolute inset-0 bg-linear-to-t from-black via-black/80 to-transparent md:hidden pointer-events-none"
        aria-hidden="true"
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0.75 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: prefersReducedMotion ? 0.2 : 0.8, ease: "easeOut" }}
      />
      <motion.div
        className="absolute inset-0 hidden md:block bg-[linear-gradient(to_right,black_0%,rgba(0,0,0,0.95)_30%,rgba(0,0,0,0.55)_58%,transparent_100%)] pointer-events-none"
        aria-hidden="true"
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0.7 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: prefersReducedMotion ? 0.2 : 0.9, ease: "easeOut" }}
      />
      <motion.div
        className="absolute inset-0 hidden md:block pointer-events-none bg-[radial-gradient(circle_at_52%_46%,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.07)_16%,rgba(0,0,0,0)_42%)]"
        aria-hidden="true"
        initial={prefersReducedMotion ? { opacity: 0.2 } : { opacity: 0 }}
        whileInView={prefersReducedMotion ? { opacity: 0.2 } : { opacity: 0.45 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={
          prefersReducedMotion
            ? { duration: 0.2 }
            : { duration: 1.1, delay: 0.25, ease: "easeOut" }
        }
      />
    </motion.div>
  );
};

export default HeroBackdropMotion;
