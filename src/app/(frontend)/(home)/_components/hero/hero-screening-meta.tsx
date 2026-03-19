import React from "react";
import Link from "next/link";
import { CalendarDays, Clapperboard, Clock3, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { ICity } from "@/interfaces/ICities";
import { ICinemaSummary } from "@/interfaces/ICinema";

interface HeroScreeningMetaProps {
  formattedDate: string;
  screeningTime: string;
  cinema: ICinemaSummary;
  city: ICity;
}

const chipClasses =
  "inline-flex items-center gap-1.5 border border-white/15 bg-white/[0.06] backdrop-blur-md px-3 py-1.5 text-xs md:text-sm uppercase tracking-[0.08em] shadow-[0_1px_3px_rgba(0,0,0,0.3)]";

const HeroScreeningMeta: React.FC<HeroScreeningMetaProps> = ({
  formattedDate,
  screeningTime,
  cinema,
  city,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2 text-white/90">
      <span className={chipClasses}>
        <CalendarDays className="size-3.5 text-blood-red" aria-hidden />
        {formattedDate}
      </span>

      <span className={chipClasses}>
        <Clock3 className="size-3.5 text-blood-red" aria-hidden />
        {screeningTime}
      </span>

      <Link
        href={`/miasta/${city.slug}`}
        className={cn(
          chipClasses,
          "hover:text-blood-red transition-colors duration-200"
        )}
      >
        <MapPin className="size-3.5 text-blood-red" aria-hidden />
        {city.name}
      </Link>

      <Link
        href={`/kina/${cinema.slug}`}
        className={cn(
          chipClasses,
          "hover:text-blood-red transition-colors duration-200"
        )}
      >
        <Clapperboard className="size-3.5 text-blood-red" aria-hidden />
        {cinema.name}
      </Link>
    </div>
  );
};

export default HeroScreeningMeta;
