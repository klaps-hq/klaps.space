import React from "react";
import { ICinemaSummary } from "@/interfaces/ICinema";
import CinemaListItem from "@/components/common/cinema-list-item";

interface CinemasCityGroupProps {
  cityName: string;
  cinemas: Omit<ICinemaSummary, "city">[];
}

const CinemasCityGroup: React.FC<CinemasCityGroupProps> = ({
  cityName,
  cinemas,
}) => {
  return (
    <div>
      <h2 className="text-white text-xs md:text-sm font-bold uppercase tracking-widest leading-none mb-6">
        {cityName}
      </h2>

      <ul className="divide-y divide-neutral-800">
        {cinemas.map((cinema) => (
          <CinemaListItem key={cinema.id} cinema={cinema} />
        ))}
      </ul>
    </div>
  );
};

export default CinemasCityGroup;
