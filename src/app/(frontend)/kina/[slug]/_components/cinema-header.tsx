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

      <address className="not-italic text-neutral-400 text-lg">
        <span>{cinema.street ? `${cinema.street}, ` : ""}</span>
        <Link
          href={`/miasta/${cinema.city.slug}`}
          className="hover:text-blood-red transition-colors"
          aria-label={`Zobacz kina w mieście ${cinema.city.name}`}
        >
          {cinema.city.name}
        </Link>
      </address>
    </div>
  );
};

export default CinemaHeader;
