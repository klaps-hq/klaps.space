"use client";

import React, { useState } from "react";
import Image from "next/image";
import NoMoviePoster from "./no-movie-poster";
import { tmdbImageSrc } from "@/lib/tmdb";

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

const MoviePoster: React.FC<MoviePosterProps> = ({
  posterUrl,
  title = "Plakat filmu",
  width,
  height,
  className,
  sizes,
  priority = false,
}) => {
  const [isError, setIsError] = useState(false);

  if (isError || !posterUrl) {
    return <NoMoviePoster width={width} height={height} />;
  }

  return (
    <Image
      src={tmdbImageSrc(posterUrl)}
      alt={`Plakat filmu: ${title}`}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      className={className}
      onError={() => {
        setIsError(true);
      }}
    />
  );
};

export default MoviePoster;
