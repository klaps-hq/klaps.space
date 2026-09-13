import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { IScreeningGroup } from "@/interfaces/IScreenings";
import { formatDateLabel } from "@/lib/utils";
import MoviePoster from "@/components/common/movie-poster";

interface PostScreeningsBlockProps {
  heading?: string | null;
  screenings: IScreeningGroup[];
  // Where "zobacz wszystkie" points: the hub matching the block's scope.
  moreHref: string;
  moreLabel: string;
}

// Compact card: the article column is narrow, so this stays denser than the
// listing grid and leads with the poster to break up a wall of prose.
const BlockCard: React.FC<{ group: IScreeningGroup }> = ({ group }) => {
  const { movie, screenings } = group;
  const next = screenings[0];

  return (
    <Link href={`/filmy/${movie.slug}`} className="group flex flex-col gap-2">
      <div className="relative aspect-[2/3] overflow-hidden bg-white/5">
        {movie.posterUrl ? (
          <MoviePoster
            posterUrl={movie.posterUrl}
            title={movie.title}
            width={300}
            height={450}
            sizes="(max-width: 768px) 40vw, 170px"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/50 text-[10px] uppercase tracking-[0.25em]">
            Bez plakatu
          </div>
        )}
      </div>
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-xs font-semibold uppercase leading-tight tracking-tight text-white line-clamp-2">
          {movie.title}
        </span>
        {next && (
          <span className="text-[10px] uppercase tracking-[0.16em] text-white/50 truncate">
            {formatDateLabel(next.date)} · {next.cinema.city.name}
          </span>
        )}
      </div>
    </Link>
  );
};

/**
 * Live repertoire embedded in an article.
 *
 * Renders nothing when the scope has no upcoming screenings: an empty box
 * mid-paragraph reads worse than no box, and the surrounding prose is
 * written to stand on its own.
 */
const PostScreeningsBlock: React.FC<PostScreeningsBlockProps> = ({
  heading,
  screenings,
  moreHref,
  moreLabel,
}) => {
  if (screenings.length === 0) return null;

  return (
    <aside className="not-prose my-10 md:my-12 border-t border-b border-white/10 py-8 md:py-10">
      <div className="mb-6 flex items-end justify-between gap-6 flex-wrap">
        <h3 className="text-lg md:text-xl font-medium -tracking-[0.01em] text-white">
          {heading?.trim() || "Aktualnie w repertuarze"}
        </h3>
        <Link
          href={moreHref}
          className="group inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-white/55 hover:text-white transition-colors border-b border-transparent hover:border-white/40 pb-0.5"
        >
          {moreLabel}
          <ArrowUpRight
            aria-hidden="true"
            className="size-3 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-6">
        {screenings.map((group) => (
          <BlockCard key={group.movie.id} group={group} />
        ))}
      </div>
    </aside>
  );
};

export default PostScreeningsBlock;
