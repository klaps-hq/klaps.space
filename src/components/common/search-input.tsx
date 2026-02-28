"use client";

import React, { useCallback } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = "Szukaj filmu...",
  className,
}) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  const handleClear = useCallback(() => {
    onChange("");
  }, [onChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape") {
        onChange("");
      }
    },
    [onChange]
  );

  return (
    <div className={cn("relative w-full max-w-sm", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500 pointer-events-none" />

      <input
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full h-10 md:h-9 pl-10 pr-9 bg-white/5 border border-white/20 text-white text-sm tracking-wide placeholder:text-white/40 outline-none transition-colors duration-200 focus:border-blood-red focus:bg-white/[0.07]"
      />

      {value.length > 0 && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Wyczyść wyszukiwanie"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors cursor-pointer"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
