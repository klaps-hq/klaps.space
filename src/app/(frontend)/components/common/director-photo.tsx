"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { resolveTmdbPhotoUrl } from "@/lib/tmdb";

interface DirectorPhotoProps {
  photoUrl: string | null;
  name: string;
  width: number;
  height: number;
  /** Responsive sizes hint - set per grid layout to avoid oversized downloads. */
  sizes?: string;
  className?: string;
  /** Set for above-the-fold (LCP) photos to skip lazy loading. */
  priority?: boolean;
}

// Up to two initials from the name, used when there is no usable photo.
const initialsOf = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

const DirectorPhoto: React.FC<DirectorPhotoProps> = ({
  photoUrl,
  name,
  width,
  height,
  sizes,
  className,
  priority = false,
}) => {
  const [isError, setIsError] = useState(false);
  const src = resolveTmdbPhotoUrl(photoUrl, "w342");

  if (!src || isError) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-white/[0.05] text-white/30",
          className
        )}
      >
        <span
          aria-hidden="true"
          className="text-lg md:text-2xl font-medium uppercase tracking-[0.15em]"
        >
          {initialsOf(name)}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={`Zdjęcie: ${name}`}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      className={className}
      onError={() => setIsError(true)}
    />
  );
};

export default DirectorPhoto;
