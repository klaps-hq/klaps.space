"use client";

import React from "react";
import { Search, X } from "lucide-react";
import { useSearchParam } from "@/hooks/use-search-param";
import { cn } from "@/lib/utils";

interface SearchFieldProps {
  className?: string;
}

const SearchField: React.FC<SearchFieldProps> = ({ className }) => {
  const { searchQuery, handleSearchChange } = useSearchParam();

  return (
    <div className={cn("relative w-full", className)}>
      <Search
        className="absolute left-0 top-1/2 -translate-y-1/2 size-4 text-white/40 pointer-events-none"
        aria-hidden="true"
      />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => handleSearchChange(e.target.value)}
        placeholder="Szukaj filmu..."
        aria-label="Szukaj filmu"
        className="w-full h-10 pl-7 pr-7 bg-transparent border-0 border-b border-white/20 text-white text-sm tracking-wide placeholder:text-white/40 focus:border-white outline-none transition-colors"
      />
      {searchQuery.length > 0 && (
        <button
          type="button"
          onClick={() => handleSearchChange("")}
          aria-label="Wyczyść wyszukiwanie"
          className="absolute right-0 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
};

export default SearchField;
