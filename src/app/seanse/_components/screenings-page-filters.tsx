"use client";

import React from "react";
import Link from "next/link";
import { IGenre } from "@/interfaces/IMovies";
import HeaderCitySelect from "@/components/layout/header/header-city-select";
import SearchInput from "@/components/common/search-input";
import ScreeningsDatePicker from "./screenings-date-picker";
import ScreeningsGenreTags from "./screenings-genre-tags";
import { useSearchParam } from "@/hooks/use-search-param";

interface ScreeningsPageFiltersProps {
  genres: IGenre[];
}

const ScreeningsPageFilters: React.FC<ScreeningsPageFiltersProps> = ({
  genres,
}) => {
  const { searchQuery, handleSearchChange } = useSearchParam();
  const genreLinks = [...genres]
    .sort((a, b) => a.name.localeCompare(b.name, "pl"))
    .slice(0, 12);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <SearchInput
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Szukaj filmu..."
        />
        <HeaderCitySelect size="md" />
      </div>

      <ScreeningsDatePicker />
      <ScreeningsGenreTags genres={genres} />
      {genreLinks.length > 0 && (
        <div className="flex flex-col gap-3">
          <span className="text-sm uppercase tracking-wider text-white/50">
            Strony gatunków
          </span>
          <div className="flex flex-wrap gap-2">
            {genreLinks.map((genre) => (
              <Link
                key={genre.id}
                href={`/gatunki/${genre.slug}`}
                className="inline-flex border border-white/15 px-3 py-1 text-xs uppercase tracking-widest text-white/80 hover:text-blood-red hover:border-blood-red/40 transition-colors"
              >
                {genre.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScreeningsPageFilters;
