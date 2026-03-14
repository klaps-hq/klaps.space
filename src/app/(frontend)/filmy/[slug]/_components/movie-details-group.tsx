import React from "react";
import MovieDetailsItem from "./movie-details-item";

type MovieDetailItem = {
  label: string;
  value: string;
};

type MovieDetailsGroupProps = {
  title: string;
  items: MovieDetailItem[];
};

const MovieDetailsGroup: React.FC<MovieDetailsGroupProps> = ({
  title,
  items,
}) => {
  if (items.length === 0) return null;

  const filteredItems = items.filter((item) => item.value.trim() !== "");

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-white text-2xl md:text-3xl font-bold uppercase tracking-wide">
        {title}
      </h2>
      <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <MovieDetailsItem
            key={item.label}
            label={item.label}
            value={item.value}
          />
        ))}
      </dl>
    </div>
  );
};

export default MovieDetailsGroup;
