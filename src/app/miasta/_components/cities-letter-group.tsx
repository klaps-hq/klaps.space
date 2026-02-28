import React from "react";
import CityLinkItem from "./city-link-item";
import { ICity } from "@/interfaces/ICities";

interface CitiesLetterGroupProps {
  letter: string;
  cities: ICity[];
}

const CitiesLetterGroup: React.FC<CitiesLetterGroupProps> = ({
  letter,
  cities,
}) => {
  return (
    <div>
      <h2 className="text-white text-xs md:text-sm font-bold uppercase tracking-widest leading-none mb-6">
        {letter}
      </h2>

      <ul className="divide-y divide-neutral-800">
        {cities.map((city) => (
          <CityLinkItem
            key={city.id}
            city={city}
            cinemasCount={city.numberOfCinemas}
          />
        ))}
      </ul>
    </div>
  );
};

export default CitiesLetterGroup;
