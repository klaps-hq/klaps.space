"use client";

import React from "react";
import { IGenre } from "@/interfaces/IMovies";
import SearchInput from "@/components/common/search-input";
import MoviesGenreTags from "./movies-genre-tags";
import { useSearchParam } from "@/hooks/use-search-param";
import {
  ScreeningsTransitionProvider,
  useScreeningsTransition,
} from "@/contexts/screenings-transition-context";

interface MoviesPageFiltersProps {
  genres: IGenre[];
}

const MoviesPageFiltersInner: React.FC<MoviesPageFiltersProps> = ({
  genres,
}) => {
  const { searchQuery, handleSearchChange } = useSearchParam();
  const { isPending } = useScreeningsTransition();

  return (
    <div
      className={`flex flex-col gap-8 ${isPending ? "opacity-50 pointer-events-none" : ""}`}
    >
      <SearchInput
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Szukaj filmu..."
      />
      <MoviesGenreTags genres={genres} />
    </div>
  );
};

const MoviesPageFilters: React.FC<MoviesPageFiltersProps> = ({ genres }) => (
  <ScreeningsTransitionProvider>
    <MoviesPageFiltersInner genres={genres} />
  </ScreeningsTransitionProvider>
);

export default MoviesPageFilters;
