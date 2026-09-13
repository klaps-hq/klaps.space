import { cn } from "@/lib/utils";
import React from "react";

interface NoMoviePosterProps {
  className?: string;
}

/**
 * Placeholder for a poster that cannot be rendered. Matches the "Bez plakatu"
 * fallback the grids show for movies with no poster at all, so a broken image
 * never reads as a different kind of gap. Sizing comes from the wrapping
 * aspect-ratio box: an intrinsic width/height would overflow it.
 */
const NoMoviePoster: React.FC<NoMoviePosterProps> = ({ className }) => {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center bg-white/5 text-white/50",
        className
      )}
    >
      <span className="text-[10px] uppercase tracking-[0.25em]">
        Bez plakatu
      </span>
    </div>
  );
};

export default NoMoviePoster;
