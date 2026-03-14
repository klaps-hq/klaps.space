import React from "react";
import Link from "next/link";
import { ICinemaSummary } from "@/interfaces/ICinema";

type ScreeningCinemaProps = {
  cinema: ICinemaSummary;
};

const ScreeningCinema: React.FC<ScreeningCinemaProps> = ({ cinema }) => {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-white text-2xl md:text-3xl font-bold uppercase tracking-wide">
        Miejsce
      </h2>

      <div className="flex flex-col gap-2 border-l-4 border-l-blood-red pl-4">
        <Link
          href={`/kina/${cinema.slug}`}
          className="text-white text-lg md:text-xl font-bold hover:text-blood-red transition-colors"
        >
          {cinema.name}
        </Link>

        {cinema.street && (
          <span className="text-neutral-400 text-sm md:text-base">
            {cinema.street}
          </span>
        )}

        <span className="text-neutral-400 text-sm md:text-base">
          {cinema.city.name}
        </span>
      </div>
    </section>
  );
};

export default ScreeningCinema;
