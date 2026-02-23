import React from "react";
import Link from "next/link";
import { IGenre } from "@/interfaces/IMovies";

interface MovieGenreLinksProps {
  genres: IGenre[];
}

const MovieGenreLinks: React.FC<MovieGenreLinksProps> = ({ genres }) => {
  if (genres.length === 0) return null;

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-white text-2xl md:text-3xl font-bold uppercase tracking-wide">
        Gatunki
      </h2>
      <div className="flex flex-wrap gap-2">
        {genres.map((genre) => (
          <Link
            key={genre.id}
            href={`/gatunki/${genre.slug}`}
            className="inline-flex items-center justify-center h-8 px-3 text-sm font-semibold uppercase tracking-[0.2em] border border-white/20 bg-white/5 text-white/80 hover:bg-blood-red/15 hover:text-blood-red hover:border-blood-red/50 transition-colors duration-200"
          >
            {genre.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MovieGenreLinks;
