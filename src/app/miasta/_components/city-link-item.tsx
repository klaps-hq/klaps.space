import React from "react";
import Link from "next/link";
import { ICity } from "@/interfaces/ICities";

interface CityLinkItemProps {
  city: ICity;
  cinemasCount: number;
}

const CityLinkItem: React.FC<CityLinkItemProps> = ({ city, cinemasCount }) => {
  return (
    <li>
      <Link
        href={`/miasta/${city.slug}`}
        className="group flex items-baseline justify-between gap-4 py-3 transition-colors duration-200 hover:text-blood-red focus-visible:text-blood-red focus-visible:outline-none"
      >
        <span className="text-neutral-300 text-base md:text-lg leading-snug group-hover:text-blood-red group-focus-visible:text-blood-red transition-colors duration-200">
          {city.name}
        </span>

        <span className="hidden md:block text-neutral-600 text-sm leading-snug shrink-0">
          {cinemasCount}{" "}
          {cinemasCount === 1 ? "kino" : cinemasCount < 5 ? "kina" : "kin"}
        </span>
      </Link>
    </li>
  );
};

export default CityLinkItem;
