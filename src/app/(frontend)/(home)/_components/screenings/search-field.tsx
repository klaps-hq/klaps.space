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
    <div
      className={cn(
        "relative flex items-center min-w-0 h-9 px-3 border-b border-white/15 focus-within:border-white/45 transition-colors",
        className
      )}
    >
      <Search
        className="size-3.5 text-white/45 shrink-0 pointer-events-none"
        aria-hidden="true"
      />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => handleSearchChange(e.target.value)}
        placeholder="Szukaj filmu po tytule..."
        aria-label="Szukaj filmu"
        className="ml-3 flex-1 min-w-0 bg-transparent text-[12px] tracking-wide text-white placeholder:text-white/40 outline-none"
      />
      {searchQuery.length > 0 && (
        <button
          type="button"
          onClick={() => handleSearchChange("")}
          aria-label="Wyczyść wyszukiwanie"
          className="ml-2 text-white/40 hover:text-white transition-colors shrink-0"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
};

export default SearchField;
