import React from "react";
import { toClientScreeningGroups } from "@/lib/screenings";
import RepertoireSectionClient, {
  type RepertoireSectionProps,
} from "./repertoire-section-client";

// Server boundary: trims the groups before they cross into the client
// island (see toClientScreeningGroups).
const RepertoireSection: React.FC<RepertoireSectionProps> = ({
  screenings,
  ...props
}) => (
  <RepertoireSectionClient screenings={toClientScreeningGroups(screenings)} {...props} />
);

export default RepertoireSection;
