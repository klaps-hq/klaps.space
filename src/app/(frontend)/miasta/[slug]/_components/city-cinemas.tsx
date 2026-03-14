import React from "react";
import { ICinemaGroup } from "@/interfaces/ICinema";
import SectionHeader from "@/components/common/section-header";
import EmptyState from "@/components/common/empty-state";
import CinemaListItem from "@/components/common/cinema-list-item";

interface CityCinemasProps {
  cinemaGroups: ICinemaGroup[];
}

const CityCinemas: React.FC<CityCinemasProps> = ({ cinemaGroups }) => {
  const cinemas = cinemaGroups.flatMap((group) => group.cinemas);

  return (
    <section className="flex flex-col gap-10">
      <SectionHeader prefix="Kina w mieście" title="Kina" />

      {cinemas.length === 0 && (
        <EmptyState
          headline="Brak kin"
          description="Nie znaleziono kin w tym mieście."
        />
      )}

      {cinemas.length > 0 && (
        <ul className="divide-y divide-neutral-800">
          {cinemas.map((cinema) => (
            <CinemaListItem key={cinema.id} cinema={cinema} />
          ))}
        </ul>
      )}
    </section>
  );
};

export default CityCinemas;
