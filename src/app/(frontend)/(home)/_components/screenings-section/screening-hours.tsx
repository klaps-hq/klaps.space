import React from "react";
import Link from "next/link";
import { IScreening } from "@/interfaces/IScreenings";
import { Button } from "@/components/ui/button";

interface ScreeningHoursProps {
  screenings: IScreening[];
}

const ScreeningHours: React.FC<ScreeningHoursProps> = ({ screenings }) => {
  if (screenings.length === 0) {
    return null;
  }

  const sortedScreenings = [...screenings].sort((a, b) =>
    a.dateTime.localeCompare(b.dateTime),
  );

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {sortedScreenings.map((screening) => (
        <Button key={screening.id} variant="secondary" size="sm" asChild>
          <Link href={`/seanse/${screening.id}`} aria-label={`Seans o ${screening.time}`}>{screening.time}</Link>
        </Button>
      ))}
    </div>
  );
};

export default ScreeningHours;
