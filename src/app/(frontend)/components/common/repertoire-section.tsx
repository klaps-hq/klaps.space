import React from "react";
import { IScreeningGroup } from "@/interfaces/IScreenings";
import { toFilterableRepertoire } from "@/lib/client-screenings";
import RepertoireSectionClient, {
  type RepertoireSectionClientProps,
} from "./repertoire-section-client";

interface RepertoireSectionProps
  extends Omit<RepertoireSectionClientProps, "repertoire"> {
  screenings: IScreeningGroup[];
}

// Server boundary: the filter island gets the compact repertoire (see
// toFilterableRepertoire) instead of whole screening groups.
const RepertoireSection: React.FC<RepertoireSectionProps> = ({
  screenings,
  ...props
}) => (
  <RepertoireSectionClient
    repertoire={toFilterableRepertoire(screenings)}
    {...props}
  />
);

export default RepertoireSection;
