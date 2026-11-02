import React from "react";
import { IScreeningGroup } from "@/interfaces/IScreenings";
import { toRepertoire } from "@/lib/client-screenings";
import { getIndexableSlugs } from "@/lib/sitemap-entries";
import { ScreeningCardGrid } from "./screening-card-grid";

interface RepertoireGridProps {
  screenings: IScreeningGroup[];
  emptyState: React.ReactNode;
}

// Server entry point: cards are client components, so only the fields they
// render cross. toRepertoire is memoized, so the filter island given the same
// groups (and the same request-cached indexable set) shares these objects
// and the payload carries them once. Noindex films are flagged per card.
const RepertoireGrid = async ({ screenings, emptyState }: RepertoireGridProps) => {
  const indexable = await getIndexableSlugs();
  return (
    <ScreeningCardGrid
      repertoire={toRepertoire(screenings, indexable?.movies ?? null)}
      emptyState={emptyState}
    />
  );
};

export default RepertoireGrid;
