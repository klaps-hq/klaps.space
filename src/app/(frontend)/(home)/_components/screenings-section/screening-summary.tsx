import React from "react";
import { Clock, Ticket } from "lucide-react";

interface ScreeningSummaryProps {
  screeningsCount: number;
  cinemasCount: number;
}

const ScreeningSummary: React.FC<ScreeningSummaryProps> = ({
  screeningsCount,
  cinemasCount,
}) => {
  if (screeningsCount <= 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 text-xs text-white/50 mt-1">
      <span className="flex items-center gap-1">
        <Clock className="size-3 text-blood-red" aria-hidden="true" />
        <span>
          {screeningsCount} {screeningsCount === 1 ? "seans" : "seansów"}
        </span>
      </span>
      
      {cinemasCount > 1 && (
        <span className="flex items-center gap-1">
          <Ticket className="size-3 text-blood-red" aria-hidden="true" />
          <span>
            {cinemasCount} {cinemasCount === 1 ? "kino" : "kin"}
          </span>
        </span>
      )}
    </div>
  );
};

export default ScreeningSummary;
