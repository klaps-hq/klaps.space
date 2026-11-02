import React from "react";
import { IScreeningGroup } from "@/interfaces/IScreenings";
import { toRepertoire } from "@/lib/client-screenings";
import { getIndexableSlugs } from "@/lib/sitemap-entries";
import RepertoireSectionClient, {
  type RepertoireSectionClientProps,
} from "./repertoire-section-client";

interface RepertoireSectionProps
  extends Omit<RepertoireSectionClientProps, "repertoire"> {
  screenings: IScreeningGroup[];
}

// Server boundary: the filter island gets the compact repertoire instead of
// whole screening groups; the same object as the card grid below (see
// toRepertoire), so the payload carries it once. Filtered views keep the
// per-card noindex flags, since they filter this same repertoire.
const RepertoireSection = async ({
  screenings,
  ...props
}: RepertoireSectionProps) => {
  const indexable = await getIndexableSlugs();
  return (
    <RepertoireSectionClient
      repertoire={toRepertoire(screenings, indexable?.movies ?? null)}
      {...props}
    />
  );
};

export default RepertoireSection;
