import React from "react";
import Link from "next/link";
import type { DirectorsBrowserItem } from "./directors-browser";
import DirectorPhoto from "@/components/common/director-photo";
import { pluralPl } from "@/lib/seo";

interface DirectorCardProps {
  director: DirectorsBrowserItem;
}

interface CardShellProps {
  /** null renders a plain block: the director's page is noindex. */
  href: string | null;
  children: React.ReactNode;
}

// Directors below the indexing threshold have a noindex page; their card
// stays visible but is not a link, so the hub spends crawl on pages Google
// can index.
const CardShell: React.FC<CardShellProps> = ({ href, children }) =>
  href ? (
    <Link href={href} className="group flex flex-col gap-2.5">
      {children}
    </Link>
  ) : (
    <div className="flex flex-col gap-2.5">{children}</div>
  );

const DirectorCard: React.FC<DirectorCardProps> = ({ director }) => {
  const { name, slug, photoUrl, moviesCount, upcomingScreeningsCount } =
    director;
  const hasUpcoming = upcomingScreeningsCount > 0;

  return (
    <CardShell href={director.linked ? `/rezyserzy/${slug}` : null}>
      {/* Grayscale by default unifies the varied source headshots into the
          site's B&W palette; colour and a slight zoom return on hover. */}
      <div className="relative aspect-[3/4] overflow-hidden bg-white/[0.04] ring-1 ring-inset ring-white/0 transition duration-300 group-hover:ring-white/15">
        <DirectorPhoto
          photoUrl={photoUrl}
          name={name}
          width={300}
          height={400}
          sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 16vw, 12vw"
          className="w-full h-full object-cover grayscale transition-[filter,scale] duration-700 ease-out group-hover:grayscale-0 group-hover:scale-[1.04]"
        />
      </div>

      <div className="flex flex-col gap-0.5 min-w-0">
        <h3 className="text-[11px] md:text-xs font-semibold uppercase leading-tight tracking-tight text-white/85 line-clamp-2 transition-colors group-hover:text-white">
          {name}
        </h3>
        {(moviesCount > 0 || hasUpcoming) && (
          <p className="text-[9px] md:text-[10px] uppercase tracking-[0.16em] text-white/50 truncate">
            {moviesCount > 0 && (
              <span>
                {moviesCount} {pluralPl(moviesCount, "film", "filmy", "filmów")}
              </span>
            )}
            {hasUpcoming && (
              <>
                {moviesCount > 0 && <span aria-hidden="true"> · </span>}
                <span className="text-white/60">
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
    </CardShell>
  );
};

export default DirectorCard;
