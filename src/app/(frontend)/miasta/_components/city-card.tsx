import React from "react";
import Link from "next/link";
import { ICity } from "@/interfaces/ICities";

interface CityCardProps {
  city: ICity;
  cinemasCount: number;
}

const CityCard: React.FC<CityCardProps> = ({ city, cinemasCount }) => {
  return (
    <li>
      <Link
        href={`/miasta/${city.slug}`}
        className="group flex items-baseline justify-between gap-4 py-4 transition-colors duration-200 hover:text-white/70 focus-visible:text-white/70 focus-visible:outline-none"
      >
        <span className="text-white text-lg md:text-xl font-semibold uppercase tracking-wide group-hover:text-white/70 group-focus-visible:text-white/70 transition-colors duration-200">
          {city.name}
        </span>
        <span className="text-neutral-600 text-sm shrink-0">
          {cinemasCount}{" "}
          {cinemasCount === 1 ? "kino" : cinemasCount < 5 ? "kina" : "kin"}
        </span>
      </Link>
    </li>
  );
};

export default CityCard;
