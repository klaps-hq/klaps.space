import React from "react";
import { ICinemaGroup } from "@/interfaces/ICinema";
import CinemasCityGroup from "./cinemas-city-group";

interface CinemasListProps {
  cinemaGroups: ICinemaGroup[];
}

const CinemasList: React.FC<CinemasListProps> = ({ cinemaGroups }) => {
  if (cinemaGroups.length === 0) {
    return (
      <p className="text-neutral-500 text-base">Brak kin do wyświetlenia.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-14 md:gap-y-16 md:gap-x-20">
      {cinemaGroups.map((group) => (
        <CinemasCityGroup
          key={group.city.id}
          cityName={group.city.name}
          cinemas={group.cinemas}
        />
      ))}
    </div>
  );
};

export default CinemasList;
