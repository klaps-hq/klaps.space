"use client";

import React, { useState } from "react";
import Image from "next/image";
import NoMoviePoster from "./no-movie-poster";
import { tmdbCdnFallbackSrc, tmdbImageSrc } from "@/lib/tmdb";

interface MoviePosterProps {
  posterUrl: string;
  title?: string;
  width: number;
  height: number;
  className?: string;
  /** Responsive sizes hint - set per grid layout to avoid oversized downloads. */
  sizes?: string;
  /** Set for above-the-fold (LCP) posters to skip lazy loading. */
  priority?: boolean;
}

/** Which source the next render attempt uses. */
type PosterSource = "mirror" | "cdn" | "none";

const MoviePoster: React.FC<MoviePosterProps> = ({
  posterUrl,
  title = "Plakat filmu",
  width,
  height,
  className,
  sizes,
  priority = false,
}) => {
  // Degrade in two steps: the mirror first, the TMDB CDN when the bucket has
  // no such file, and the placeholder only once both are gone. Mirror gaps
  // are common enough (the scraper mirrors newly added movies only) that
  // dropping straight to a placeholder loses posters that do exist.
  const [source, setSource] = useState<PosterSource>("mirror");

  const cdnSrc = posterUrl ? tmdbCdnFallbackSrc(posterUrl) : null;
  const src =
    source === "mirror" && posterUrl
      ? tmdbImageSrc(posterUrl)
      : source === "cdn"
        ? cdnSrc
        : null;

  if (!src) {
    return <NoMoviePoster />;
  }

  return (
    <Image
      key={src}
      src={src}
      alt={`Plakat filmu: ${title}`}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      className={className}
      onError={() => {
        setSource(source === "mirror" && cdnSrc ? "cdn" : "none");
      }}
    />
  );
};

export default MoviePoster;
