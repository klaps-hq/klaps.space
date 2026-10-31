import React from "react";
import { IScreeningGroup } from "@/interfaces/IScreenings";
import { toRepertoire } from "@/lib/client-screenings";
import RepertoireSectionClient, {
  type RepertoireSectionClientProps,
} from "./repertoire-section-client";

interface RepertoireSectionProps
  extends Omit<RepertoireSectionClientProps, "repertoire"> {
  screenings: IScreeningGroup[];
}

// Server boundary: the filter island gets the compact repertoire instead of
// whole screening groups; the same object as the card grid below (see
// toRepertoire), so the payload carries it once.
const RepertoireSection: React.FC<RepertoireSectionProps> = ({
  screenings,
  ...props
}) => (
  <RepertoireSectionClient
    repertoire={toRepertoire(screenings)}
    {...props}
  />
);

export default RepertoireSection;
