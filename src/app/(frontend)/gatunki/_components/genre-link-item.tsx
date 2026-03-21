import React from "react";
import Link from "next/link";
import { IGenre } from "@/interfaces/IMovies";

interface GenreLinkItemProps {
  genre: IGenre;
}

const GenreLinkItem: React.FC<GenreLinkItemProps> = ({ genre }) => {
  return (
    <Link
      href={`/gatunki/${genre.slug}`}
      className="group flex items-center justify-between py-4 md:py-5 border-b border-white/[0.06] transition-colors duration-300"
    >
      <span className="text-neutral-300 text-base md:text-lg font-semibold uppercase tracking-wide group-hover:text-blood-red transition-colors duration-300">
        {genre.name}
      </span>

      <span className="text-neutral-700 text-sm group-hover:text-blood-red group-hover:translate-x-1 transition-all duration-300">
        &rarr;
      </span>
    </Link>
  );
};

export default GenreLinkItem;
