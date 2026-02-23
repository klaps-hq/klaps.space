import React from "react";
import StudioCinemaItem from "./studio-cinema-item";

type StudioCinema = {
  id: number;
  slug: string;
  name: string;
  cityName: string;
};

interface StudioCinemasListProps {
  cinemas: StudioCinema[];
}

const StudioCinemasList: React.FC<StudioCinemasListProps> = ({ cinemas }) => {
  return (
    <ul className="grid grid-cols-2 md:grid-cols-4 gap-y-12 md:gap-y-14 md:gap-x-20">
      {cinemas.map((cinema) => (
        <StudioCinemaItem key={cinema.id} cinema={cinema} />
      ))}
    </ul>
  );
};

export default StudioCinemasList;
