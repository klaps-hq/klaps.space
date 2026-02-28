"use client";

import React, { useState } from "react";
import Image from "next/image";
import NoMoviePoster from "./no-movie-poster";

interface MoviePosterProps {
  posterUrl: string;
  title?: string;
  width: number;
  height: number;
  className?: string;
}

const MoviePoster: React.FC<MoviePosterProps> = ({
  posterUrl,
  title = "Plakat filmu",
  width,
  height,
  className,
}) => {
  const [isError, setIsError] = useState(false);

  if (isError || !posterUrl) {
    return <NoMoviePoster width={width} height={height} />;
  }

  return (
    <Image
      src={posterUrl}
      alt={`Plakat filmu: ${title}`}
      width={width}
      height={height}
      className={className}
      onError={() => {
        setIsError(true);
      }}
    />
  );
};

export default MoviePoster;
