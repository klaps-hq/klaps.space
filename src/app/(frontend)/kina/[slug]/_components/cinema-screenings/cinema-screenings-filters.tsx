"use client";

import React from "react";
import { IGenre } from "@/interfaces/IMovies";
import SearchInput from "@/components/common/search-input";
import ScreeningsDatePicker from "@/app/seanse/_components/screenings-date-picker";
import ScreeningsGenreTags from "@/app/seanse/_components/screenings-genre-tags";
import { useSearchParam } from "@/hooks/use-search-param";

interface CinemaScreeningsFiltersProps {
  genres: IGenre[];
}

const CinemaScreeningsFilters: React.FC<CinemaScreeningsFiltersProps> = ({
  genres,
}) => {
  const { searchQuery, handleSearchChange } = useSearchParam();

  return (
    <div className="flex flex-col gap-8">
      <SearchInput
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Szukaj filmu..."
      />

      <ScreeningsDatePicker />
      <ScreeningsGenreTags genres={genres} />
    </div>
  );
};

export default CinemaScreeningsFilters;
