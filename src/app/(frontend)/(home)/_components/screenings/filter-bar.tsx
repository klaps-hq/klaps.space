"use client";

import React from "react";
import { IGenre } from "@/interfaces/IMovies";
import SearchField from "./search-field";
import DateStrip from "./date-strip";
import GenreChips from "./genre-chips";
import CityField from "./city-field";

interface FilterBarProps {
  genres: IGenre[];
}

const FilterBar: React.FC<FilterBarProps> = ({ genres }) => (
  <div className="flex flex-col gap-3 md:gap-4">
    <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
      <SearchField className="md:max-w-sm md:flex-1" />
      <div className="flex items-center gap-3 md:ml-auto">
        <CityField />
      </div>
    </div>
    <DateStrip />
    <GenreChips genres={genres} />
  </div>
);

export default FilterBar;
