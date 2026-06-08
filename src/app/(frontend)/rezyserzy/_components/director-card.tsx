import React from "react";
import Link from "next/link";
import { IDirector } from "@/interfaces/IDirectors";
import DirectorPhoto from "@/components/common/director-photo";
import { pluralPl } from "@/lib/seo";

interface DirectorCardProps {
  director: IDirector;
}

const DirectorCard: React.FC<DirectorCardProps> = ({ director }) => {
  const { name, slug, photoUrl, moviesCount, upcomingScreeningsCount } =
    director;

  return (
    <Link
      href={`/rezyserzy/${slug}`}
      className="group flex flex-col gap-3"
      aria-label={`Przejdź do reżysera: ${name}`}
    >
      <div className="relative aspect-[3/4] overflow-hidden border border-white/10 bg-white/[0.03]">
        <DirectorPhoto
          photoUrl={photoUrl}
          name={name}
          width={300}
          height={400}
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 17vw"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
        />
      </div>

      <div className="flex flex-col gap-1 min-w-0">
        <h3 className="text-xs md:text-sm font-semibold uppercase leading-tight tracking-tight text-white line-clamp-2 group-hover:text-white/90">
          {name}
        </h3>
        {(moviesCount > 0 || upcomingScreeningsCount > 0) && (
          <p className="text-[9px] md:text-[10px] uppercase tracking-[0.18em] text-white/45 truncate">
            {moviesCount > 0 && (
              <span>
                {moviesCount} {pluralPl(moviesCount, "film", "filmy", "filmów")}
              </span>
            )}
            {upcomingScreeningsCount > 0 && (
              <>
                {moviesCount > 0 && <span aria-hidden="true"> · </span>}
                <span className="text-white/70">
                  {upcomingScreeningsCount}{" "}
                  {pluralPl(
                    upcomingScreeningsCount,
                    "seans",
                    "seanse",
                    "seansów"
                  )}
                </span>
              </>
            )}
          </p>
        )}
      </div>
    </Link>
  );
};

export default DirectorCard;
