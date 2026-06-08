"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Play } from "lucide-react";
import { IMovie } from "@/interfaces/IMovies";
import { tmdbImageUrl } from "@/lib/tmdb";
import { formatDuration, getYouTubeEmbedUrl } from "@/lib/utils";
import TrailerModal from "@/components/common/trailer-modal";
import { PAGE_HEADING_CLASSES } from "@/components/ui/page-heading";

interface MovieHeroProps {
  movie: IMovie;
}

const MovieHero: React.FC<MovieHeroProps> = ({ movie }) => {
  const ref = useRef<HTMLElement>(null);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const embedUrl = movie.videoUrl ? getYouTubeEmbedUrl(movie.videoUrl) : null;

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
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* w1280 instead of original: TMDB originals are multi-MB and
                slow down the optimizer fetch; the backdrop sits under a
                heavy gradient + grain so the smaller source is fine. */}
            <Image
              src={tmdbImageUrl(movie.backdropUrl, "w1280")}
              alt={movie.title}
              fill
              sizes="100vw"
              quality={60}
              className="object-cover"
              priority
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
              // Short delays - the h1 below is the LCP element.
              visible: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
            }}
          >
            {metaParts.length > 0 && (
              <motion.span
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
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
                  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                },
              }}
              className={PAGE_HEADING_CLASSES.detail}
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
                    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
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
                    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
                className="text-base md:text-lg text-white/85 leading-relaxed font-light max-w-2xl mt-2 line-clamp-4 md:line-clamp-none"
              >
                {movie.description}
              </motion.p>
            )}
            {embedUrl && (
              <motion.button
                type="button"
                onClick={() => setTrailerOpen(true)}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
                className="group mt-4 inline-flex w-fit items-center gap-3 border border-white/30 hover:border-white hover:bg-white/[0.06] px-6 md:px-8 py-3 md:py-3.5 text-[11px] md:text-xs uppercase tracking-[0.28em] text-white transition-colors"
              >
                <Play
                  aria-hidden="true"
                  className="size-3 fill-current transition-transform group-hover:scale-110"
                />
                Zwiastun
              </motion.button>
            )}
          </motion.div>
        </motion.div>
      </div>

      {embedUrl && (
        <TrailerModal
          open={trailerOpen}
          embedUrl={embedUrl}
          movieTitle={movie.title}
          onClose={() => setTrailerOpen(false)}
        />
      )}
    </section>
  );
};

export default MovieHero;
