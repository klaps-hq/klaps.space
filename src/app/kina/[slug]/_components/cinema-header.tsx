import React from "react";
import { ICinema } from "@/interfaces/ICinema";
import SectionHeader from "@/components/common/section-header";
import Link from "next/link";

interface CinemaHeaderProps {
  cinema: ICinema;
}

const CinemaHeader: React.FC<CinemaHeaderProps> = ({ cinema }) => {
  return (
    <div className="flex flex-col gap-6">
      <SectionHeader title={cinema.name} />

      <div className="flex flex-col gap-1 max-w-fit">
        {cinema.street && (
          <span className="text-neutral-400 text-lg">{cinema.street}</span>
        )}

        <Link
          href={`/miasta/${cinema.city.slug}`}
          className="text-neutral-400 text-lg hover:text-blood-red transition-colors"
        >
          {cinema.city.name}
        </Link>
      </div>
    </div>
  );
};

export default CinemaHeader;
