"use client";

import React, { useState, useCallback } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useGenreParam } from "@/hooks/use-genre-param";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { IGenre } from "@/interfaces/IMovies";
import { cn } from "@/lib/utils";

const VISIBLE_COUNT = 10;

interface ScreeningsGenreTagsProps {
  genres: IGenre[];
  className?: string;
}

const ScreeningsGenreTags: React.FC<ScreeningsGenreTagsProps> = ({
  genres,
  className,
}) => {
  const { selectedGenre, handleGenreChange, options } = useGenreParam(genres);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  if (genres.length === 0) return null;

  const hasMore = options.length > VISIBLE_COUNT;
  const visibleOptions = isExpanded ? options : options.slice(0, VISIBLE_COUNT);

  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm uppercase tracking-wider text-white/50">
        Gatunek
      </span>
      <RadioGroup
        value={selectedGenre}
        onValueChange={handleGenreChange}
        className={cn("flex flex-wrap gap-2", className)}
      >
        {visibleOptions.map((genre) => (
          <RadioGroupItem
            key={genre.value || "all"}
            value={genre.value}
            variant="tag"
            size="sm"
          >
            {genre.label}
          </RadioGroupItem>
        ))}
      </RadioGroup>

      {hasMore && (
        <button
          type="button"
          onClick={handleToggle}
          className="inline-flex items-center gap-2 self-start px-3 py-1.5 text-xs uppercase tracking-widest text-white/70 hover:text-blood-red border border-white/15 hover:border-blood-red/50 transition-colors cursor-pointer mt-1"
        >
          {isExpanded ? (
            <>
              Zwiń gatunki
              <ChevronUp className="size-3.5" />
            </>
          ) : (
            <>
              Pokaż wszystkie ({options.length - VISIBLE_COUNT} więcej)
              <ChevronDown className="size-3.5" />
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default ScreeningsGenreTags;
