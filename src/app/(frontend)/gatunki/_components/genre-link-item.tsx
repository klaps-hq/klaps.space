import React from "react";
import Link from "next/link";
import { IGenre } from "@/interfaces/IMovies";

interface GenreLinkItemProps {
  genre: IGenre;
}

const GenreLinkItem: React.FC<GenreLinkItemProps> = ({ genre }) => {
  return (
    <li className="md:border-b md:border-neutral-800">
      <Link
        href={`/gatunki/${genre.slug}`}
        className="group flex items-baseline gap-4 py-3 transition-colors duration-200 hover:text-blood-red focus-visible:text-blood-red focus-visible:outline-none"
      >
        <span className="text-neutral-300 text-base md:text-lg leading-snug group-hover:text-blood-red group-focus-visible:text-blood-red transition-colors duration-200">
          {genre.name}
        </span>
      </Link>
    </li>
  );
};

export default GenreLinkItem;
