import React from "react";
import Link from "next/link";

interface StudioCinemaItemProps {
  cinema: {
    id: number;
    slug: string;
    name: string;
    cityName: string;
  };
}

const StudioCinemaItem: React.FC<StudioCinemaItemProps> = ({ cinema }) => {
  return (
    <li className="group">
      <span className="block text-white text-xs md:text-sm font-bold uppercase tracking-widest leading-none">
        {cinema.cityName}
      </span>

      <Link
        href={`/kina/${cinema.slug}`}
        className="mt-2 inline-block text-neutral-300 text-lg md:text-xl leading-snug transition-colors duration-200 hover:text-blood-red focus-visible:text-blood-red"
      >
        {cinema.name}
      </Link>
    </li>
  );
};

export default StudioCinemaItem;
