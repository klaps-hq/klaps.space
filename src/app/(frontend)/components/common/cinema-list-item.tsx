import React from "react";
import Link from "next/link";
import { ICinemaSummary } from "@/interfaces/ICinema";

interface CinemaListItemProps {
  cinema: Omit<ICinemaSummary, "city">;
}

const CinemaListItem: React.FC<CinemaListItemProps> = ({ cinema }) => {
  return (
    <li>
      <Link
        href={`/kina/${cinema.slug}`}
        className="group flex items-baseline justify-between gap-4 py-3 transition-colors duration-200 hover:text-white focus-visible:text-white focus-visible:outline-none"
      >
        <span className="text-neutral-300 text-base md:text-lg leading-snug group-hover:text-white group-focus-visible:text-white transition-colors duration-200">
          {cinema.name}
        </span>

        {cinema.street && (
          <span className="hidden md:block text-neutral-600 text-sm leading-snug shrink-0">
            {cinema.street}
          </span>
        )}
      </Link>
    </li>
  );
};

export default CinemaListItem;
