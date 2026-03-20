"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
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

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const smoothX = useSpring(rawX, { stiffness: 40, damping: 25 });
  const smoothY = useSpring(rawY, { stiffness: 40, damping: 25 });

  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      rawX.set((e.clientX / window.innerWidth - 0.5) * -16);
      rawY.set((e.clientY / window.innerHeight - 0.5) * -12);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [prefersReducedMotion, rawX, rawY]);

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
      <motion.div
        className="absolute -inset-5"
        style={prefersReducedMotion ? undefined : { x: smoothX, y: smoothY }}
        animate={prefersReducedMotion ? undefined : { scale: 1.06 }}
        transition={
          prefersReducedMotion ? undefined : { duration: 20, ease: "linear" }
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

      <motion.div
        className="absolute inset-0 bg-[linear-gradient(to_top,black_0%,rgba(0,0,0,0.88)_22%,rgba(0,0,0,0.35)_52%,rgba(0,0,0,0.08)_75%,transparent_100%)] pointer-events-none"
        aria-hidden="true"
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0.5 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{
          duration: prefersReducedMotion ? 0.2 : 1.2,
          ease: "easeOut",
        }}
      />

      <motion.div
        className="absolute inset-0 hidden md:block bg-[linear-gradient(to_right,rgba(0,0,0,0.82)_0%,rgba(0,0,0,0.55)_25%,rgba(0,0,0,0.12)_50%,transparent_65%)] pointer-events-none"
        aria-hidden="true"
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0.4 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{
          duration: prefersReducedMotion ? 0.2 : 1.0,
          ease: "easeOut",
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,transparent_20%,rgba(0,0,0,0.6)_100%)]"
        aria-hidden="true"
      />

      <div
        className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none"
        aria-hidden="true"
      />
    </motion.div>
  );
};

export default HeroBackdropMotion;
