"use client";

import React from "react";
import { IGenre } from "@/interfaces/IMovies";
import SearchField from "./search-field";
import CityField from "./city-field";
import DateField from "./date-field";
import GenreField from "./genre-field";
import MyCinemasField from "./my-cinemas-field";

interface FilterBarProps {
  genres: IGenre[];
  hideCity?: boolean;
  hideGenres?: boolean;
  // "Moje kina" chip; only /seanse can serve that view.
  showMyCinemas?: boolean;
}

const FilterBar: React.FC<FilterBarProps> = ({
  genres,
  hideCity = false,
  hideGenres = false,
  showMyCinemas = false,
}) => (
  <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
    <SearchField className="md:w-72 lg:w-80" />
    <div className="flex flex-col md:flex-row md:flex-wrap md:items-center gap-3 md:ml-auto">
      {showMyCinemas && <MyCinemasField className="w-full md:w-auto" />}
      <DateField className="w-full md:w-auto" />
      {!hideGenres && <GenreField genres={genres} className="w-full md:w-auto" />}
      {!hideCity && <CityField className="w-full md:w-auto" />}
    </div>
  </div>
);

export default FilterBar;
