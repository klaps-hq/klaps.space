import React from "react";
import CitiesLetterGroup from "./cities-letter-group";
import { ICity } from "@/interfaces/ICities";

interface CitiesListProps {
  cities: ICity[];
}

const CitiesList: React.FC<CitiesListProps> = ({ cities }) => {
  if (cities.length === 0) {
    return (
      <p className="text-neutral-500 text-base">Brak miast do wyświetlenia.</p>
    );
  }

  const sortedGroups = [...cities].sort((a, b) =>
    a.name.localeCompare(b.name, "pl")
  );

  const letterGroups = sortedGroups.reduce<Record<string, ICity[]>>(
    (acc, city) => {
      const letter = city.name[0].toUpperCase();
      if (!acc[letter]) acc[letter] = [];
      acc[letter].push(city);
      return acc;
    },
    {}
  );

  const sortedLetters = Object.keys(letterGroups).sort((a, b) =>
    a.localeCompare(b, "pl")
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-14 md:gap-y-16 md:gap-x-20">
      {sortedLetters.map((letter) => (
        <CitiesLetterGroup
          key={letter}
          letter={letter}
          cities={letterGroups[letter]}
        />
      ))}
    </div>
  );
};

export default CitiesList;
