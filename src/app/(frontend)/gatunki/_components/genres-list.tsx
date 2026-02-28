import React from "react";
import { IGenre } from "@/interfaces/IMovies";
import GenreLinkItem from "./genre-link-item";

interface GenresListProps {
  genres: IGenre[];
}

const GenresList: React.FC<GenresListProps> = ({ genres }) => {
  if (genres.length === 0) {
    return (
      <p className="text-neutral-500 text-base">
        Brak gatunków do wyświetlenia.
      </p>
    );
  }

  const sortedGenres = [...genres].sort((a, b) =>
    a.name.localeCompare(b.name, "pl")
  );

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-20 divide-y divide-neutral-800 md:divide-y-0">
      {sortedGenres.map((genre) => (
        <GenreLinkItem key={genre.id} genre={genre} />
      ))}
    </ul>
  );
};

export default GenresList;
