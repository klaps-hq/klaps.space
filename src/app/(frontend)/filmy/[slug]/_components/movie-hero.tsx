"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { IMovie } from "@/interfaces/IMovies";
import { tmdbImageUrl } from "@/lib/tmdb";
import { formatDuration } from "@/lib/utils";

interface MovieHeroProps {
  movie: IMovie;
}

const MovieHero: React.FC<MovieHeroProps> = ({ movie }) => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);

  const metaParts = [
    movie.productionYear?.toString(),
    movie.duration ? formatDuration(movie.duration) : null,
    movie.genres?.[0]?.name,
  ].filter(Boolean) as string[];

  return (
    <section ref={ref} className="relative w-full bg-black overflow-hidden">
      <div className="relative h-[85vh] min-h-[640px]">
        {movie.backdropUrl && (
          <motion.div
            className="absolute inset-0"
            style={{ y: imageY, scale: imageScale }}
            initial={{ opacity: 0, scale: 1.12 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={tmdbImageUrl(movie.backdropUrl, "original")}
              alt={movie.title}
              fill
              sizes="100vw"
              className="object-cover"
              priority
              unoptimized
            />
          </motion.div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />

        <div
          className="pointer-events-none absolute inset-0 z-[3] opacity-[0.12] mix-blend-overlay"
          aria-hidden="true"
        >
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <filter id="movie-hero-grain">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.9"
                numOctaves="3"
                stitchTiles="stitch"
              />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#movie-hero-grain)" />
          </svg>
        </div>

        <motion.nav
          className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between gap-4 px-6 md:px-12 lg:px-16 py-6"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link href="/" className="flex items-center gap-2.5 text-white">
            <svg
              viewBox="0 0 28 20"
              className="w-5 h-5"
              fill="currentColor"
              aria-hidden="true"
            >
              <polygon points="0,8 28,0 28,20 0,12" />
            </svg>
            <span className="text-xl font-medium lowercase tracking-tight">
              klaps
            </span>
          </Link>
          <div className="flex items-center gap-2 text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/60">
            <Link href="/filmy" className="hover:text-white transition-colors">
              Filmy
            </Link>
            <span aria-hidden="true" className="text-white/30">
              ›
            </span>
            <span className="text-white/85 truncate max-w-[180px] md:max-w-[320px]">
              {movie.title}
            </span>
          </div>
        </motion.nav>

        <motion.div
          className="absolute inset-0 z-[4] flex flex-col justify-end px-6 md:px-12 lg:px-16 pb-12 md:pb-16"
          style={{ y: contentY }}
        >
          <motion.div
            className="flex flex-col gap-5 md:gap-6 max-w-3xl"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1, delayChildren: 0.5 } },
            }}
          >
            {metaParts.length > 0 && (
              <motion.span
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
                className="text-xs md:text-sm uppercase tracking-[0.3em] text-white/65"
              >
                {metaParts.join(" · ")}
              </motion.span>
            )}
            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
                },
              }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[120px] font-bold uppercase leading-[0.9] -tracking-[0.02em] text-white"
            >
              {movie.title}
            </motion.h1>
            {movie.titleOriginal && movie.titleOriginal !== movie.title && (
              <motion.span
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
                className="text-base md:text-xl text-white/55 italic font-light"
              >
                {movie.titleOriginal}
              </motion.span>
            )}
            {movie.description && (
              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
                className="text-base md:text-lg text-white/85 leading-relaxed font-light max-w-2xl mt-2 line-clamp-4 md:line-clamp-none"
              >
                {movie.description}
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default MovieHero;
