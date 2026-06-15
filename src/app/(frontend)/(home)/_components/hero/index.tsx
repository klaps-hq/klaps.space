"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { Play } from "lucide-react";
import { IRandomScreening } from "@/interfaces/IScreenings";
import { tmdbImageSrc } from "@/lib/tmdb";
import { formatDuration, getYouTubeEmbedUrl, WARSAW_TZ } from "@/lib/utils";
import { wallTimeToInstant } from "@/lib/warsaw-time";
import TrailerModal from "@/components/common/trailer-modal";
import MobileNav from "@/components/common/mobile-nav";
import { NAV_LINKS } from "@/components/common/nav-links";
import HeroParallax from "./hero-parallax";
import { CharsReveal, TitleReveal } from "./text-reveal";

interface HeroProps {
  screening: IRandomScreening | null;
  // Precomputed on the server (lib/blur.ts); instant blurred preview
  // while the full-size hero images load.
  backdropBlurDataUrl?: string | null;
  posterBlurDataUrl?: string | null;
}

// Two CTAs: the fallback points at the full listing, the showcase hero
// points at the featured movie page, so each label matches its target.
const CTA_ALL_SCREENINGS = "ZOBACZ SEANSE";
const CTA_MOVIE = "ZOBACZ FILM";

// Short entrance animations - the hero title is the LCP element,
// so long delays directly hurt Core Web Vitals.
const navVariants: Variants = {
  hidden: { opacity: 0, y: -16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] },
  },
};

const contentContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.15,
    },
  },
};

const contentItemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const HeroNav: React.FC = () => (
  <motion.nav
    className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 md:px-12 lg:px-16 py-6"
    variants={navVariants}
    initial="hidden"
    animate="visible"
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
    <div className="hidden md:flex items-center gap-6 lg:gap-8 text-sm text-white/80">
      {NAV_LINKS.map((link) => (
        // py/-my widen the ~20px text links to a 44px hit area without
        // moving anything visually.
        <Link
          key={link.href}
          href={link.href}
          className="py-3 -my-3 hover:text-white transition-colors"
        >
          {link.label}
        </Link>
      ))}
    </div>
    <MobileNav links={NAV_LINKS} />
  </motion.nav>
);

const HeroFallback: React.FC = () => (
  <section className="h-screen w-full bg-black flex items-center justify-center p-4 md:p-8">
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-white/[0.03]">
      <HeroNav />
      <motion.div
        className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 lg:p-16"
        variants={contentContainerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col gap-6 max-w-4xl">
          <motion.h1
            variants={contentItemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase text-white leading-[0.95]"
          >
            Seanse specjalne i stare filmy w kinach studyjnych w Polsce
          </motion.h1>
          <motion.div variants={contentItemVariants} className="self-start">
            <Link
              href="/seanse"
              className="text-base text-white border-b border-white/50 pb-0.5 hover:border-white transition-colors"
            >
              {CTA_ALL_SCREENINGS}
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  </section>
);

// The hero is a showcase - render it only when the movie has complete data,
// otherwise fall back to the generic hero instead of showing empty gaps.
const hasCompleteHeroData = (screening: IRandomScreening): boolean =>
  Boolean(
    screening.movie.title?.trim() &&
      screening.movie.description?.trim() &&
      screening.movie.backdropUrl
  );

const Hero: React.FC<HeroProps> = ({
  screening,
  backdropBlurDataUrl,
  posterBlurDataUrl,
}) => {
  const [trailerOpen, setTrailerOpen] = useState(false);

  if (!screening || !hasCompleteHeroData(screening)) {
    return <HeroFallback />;
  }

  const embedUrl = screening.movie.videoUrl
    ? getYouTubeEmbedUrl(screening.movie.videoUrl)
    : null;

  // The API's dateTime is Warsaw wall time with a misleading "Z";
  // resolve the real instant first or late-evening screenings would
  // render with the next day's date.
  const screeningDate = wallTimeToInstant(screening.screening.dateTime);
  // Explicit timeZone: this runs on the server (UTC) and again in the
  // visitor's browser, and a zone-dependent result breaks hydration.
  const formattedDate = new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "long",
    timeZone: WARSAW_TZ,
  }).format(screeningDate);
  // Older API responses may omit the field, so default to no credit line.
  const directors = screening.movie.directors ?? [];

  return (
    <section className="h-screen w-full bg-black flex items-center justify-center p-4 md:p-8">
      {/* Stable, keyword-bearing h1 - the visible movie title rotates
          per visit, so it renders as h2 (see TitleReveal). */}
      <h1 className="sr-only">
        Seanse specjalne i stare filmy w kinach studyjnych w Polsce
      </h1>
      {/* "original" is mandatory here, not a quality choice: the MinIO
          mirror is populated by the scraper and only holds the *original*
          backdrop, so any other size (e.g. w1280) 404s and the hero shows
          just the blur. The optimizer still downscales the original to the
          viewport, so the client payload stays small. Served by the
          scraper-populated MinIO mirror, not the TMDB CDN. */}
      <HeroParallax
        backdropSrc={tmdbImageSrc(
          screening.movie.backdropUrl ?? "",
          "original"
        )}
        posterSrc={
          screening.movie.posterUrl
            ? tmdbImageSrc(screening.movie.posterUrl, "w780")
            : null
        }
        backdropBlurDataUrl={backdropBlurDataUrl}
        posterBlurDataUrl={posterBlurDataUrl}
        alt={screening.movie.title}
      >
        <HeroNav />

        <motion.div
          className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 lg:p-16"
          variants={contentContainerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-12">
            <div className="flex flex-col gap-6 md:flex-1 md:min-w-0">
              <CharsReveal
                segments={[
                  { text: `${formattedDate} · ${screening.screening.time} · ` },
                  {
                    text: screening.screening.cinema.name,
                    href: `/kina/${screening.screening.cinema.slug}`,
                  },
                  { text: " · " },
                  {
                    text: screening.screening.cinema.city.name,
                    href: `/miasta/${screening.screening.cinema.city.slug}`,
                  },
                ]}
                className="text-xs md:text-sm uppercase tracking-[0.2em] text-white/70"
              />

              <TitleReveal
                text={screening.movie.title}
                className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase text-white leading-[0.95]"
              />

              <motion.div
                variants={contentItemVariants}
                className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/60"
              >
                {screening.movie.duration && (
                  <span>{formatDuration(screening.movie.duration)}</span>
                )}
                {screening.movie.duration &&
                  screening.movie.productionYear && <span>&middot;</span>}
                {screening.movie.productionYear && (
                  <span>{screening.movie.productionYear}</span>
                )}
                {screening.movie.productionYear &&
                  screening.movie.genres.length > 0 && <span>&middot;</span>}
                {screening.movie.genres.length > 0 && (
                  <span className="uppercase tracking-wider">
                    {screening.movie.genres
                      .slice(0, 2)
                      .map((g) => g.name)
                      .join(" / ")}
                  </span>
                )}
                {directors.length > 0 && (
                  <>
                    {(screening.movie.duration ||
                      screening.movie.productionYear ||
                      screening.movie.genres.length > 0) && (
                      <span>&middot;</span>
                    )}
                    <span className="uppercase tracking-wider">
                      Reż.{" "}
                      {directors.map((person, index) => (
                        <React.Fragment key={person.id ?? person.name}>
                          {index > 0 && ", "}
                          {person.slug ? (
                            <Link
                              href={`/rezyserzy/${person.slug}`}
                              className="border-b border-white/30 hover:border-white hover:text-white transition-colors"
                            >
                              {person.name}
                            </Link>
                          ) : (
                            person.name
                          )}
                        </React.Fragment>
                      ))}
                    </span>
                  </>
                )}
              </motion.div>
            </div>

            <div className="flex flex-col gap-5 md:w-xl md:shrink-0">
              <motion.p
                variants={contentItemVariants}
                className="text-base md:text-lg text-white/85 font-light line-clamp-4"
              >
                {screening.movie.description}
              </motion.p>
              <motion.div
                variants={contentItemVariants}
                className="flex flex-wrap items-center gap-x-8 gap-y-3 self-start"
              >
                <Link
                  href={`/filmy/${screening.movie.slug}`}
                  className="text-base text-white border-b border-white/50 pb-0.5 hover:border-white transition-colors"
                >
                  {CTA_MOVIE}
                </Link>
                {embedUrl && (
                  <button
                    type="button"
                    onClick={() => setTrailerOpen(true)}
                    className="group inline-flex items-center gap-2 text-base text-white/70 border-b border-white/30 pb-0.5 hover:text-white hover:border-white transition-colors"
                  >
                    <Play
                      aria-hidden="true"
                      className="size-3 fill-current transition-transform group-hover:scale-110"
                    />
                    Zwiastun
                  </button>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </HeroParallax>

      {embedUrl && (
        <TrailerModal
          open={trailerOpen}
          embedUrl={embedUrl}
          movieTitle={screening.movie.title}
          onClose={() => setTrailerOpen(false)}
        />
      )}
    </section>
  );
};

export default Hero;
