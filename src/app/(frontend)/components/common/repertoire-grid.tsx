import React from "react";
import { IScreeningGroup } from "@/interfaces/IScreenings";
import ScreeningCard from "../../(home)/_components/screenings/screening-card";

interface RepertoireGridProps {
  screenings: IScreeningGroup[];
  // Shown when the list is empty. When this grid is rendered by the server
  // (the default, unfiltered view) the node must be hook-free, otherwise a
  // hook like useSearchParams would opt the page out of static prerendering.
  emptyState: React.ReactNode;
}

// Hook-free so it renders on the server: the default repertoire lands in the
// static HTML and crawlers read it without executing JS. The same component
// is reused client-side for filtered views.
const RepertoireGrid: React.FC<RepertoireGridProps> = ({
  screenings,
  emptyState,
}) => {
  if (screenings.length === 0) return <>{emptyState}</>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-x-4 md:gap-x-6 gap-y-10 md:gap-y-12">
      {screenings.map((group) => (
        <ScreeningCard key={group.movie.id} group={group} />
      ))}
    </div>
  );
};

export default RepertoireGrid;
