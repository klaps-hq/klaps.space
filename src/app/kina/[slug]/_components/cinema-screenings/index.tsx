import React from "react";
import { IScreeningGroup } from "@/interfaces/IScreenings";
import SectionHeader from "@/components/common/section-header";
import MoviesGrid from "@/app/filmy/_components/movies-grid";
import EmptyState from "@/components/common/empty-state";

interface CinemaScreeningsProps {
  screenings: IScreeningGroup[];
}

const CinemaScreenings: React.FC<CinemaScreeningsProps> = ({ screenings }) => {
  const movies = screenings.map((s) => s.movie);

  return (
    <section className="flex flex-col gap-10">
      <SectionHeader prefix="Seanse dla kina" title="Aktualne seanse" />

      {screenings.length === 0 ? (
        <EmptyState
          headline="Brak seansów"
          description="Aktualnie nie ma zaplanowanych seansów w tym kinie."
        />
      ) : (
        <MoviesGrid
          movies={movies}
          screenings={screenings}
          showDescription={false}
        />
      )}
    </section>
  );
};

export default CinemaScreenings;
