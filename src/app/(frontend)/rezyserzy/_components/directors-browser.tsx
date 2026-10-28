"use client";

import React, { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { IDirector } from "@/interfaces/IDirectors";
import EmptyState from "@/components/common/empty-state";
import { pluralPl } from "@/lib/seo";
import DirectorCard from "./director-card";

/** The card fields only - full records (with bios) stay on the server. */
export interface DirectorsBrowserItem
  extends Pick<
    IDirector,
    "id" | "slug" | "name" | "photoUrl" | "moviesCount" | "upcomingScreeningsCount"
  > {
  /** False when the director's page is noindex: the card renders unlinked. */
  linked: boolean;
}

interface DirectorsBrowserProps {
  /** Pre-filtered and sorted server-side (directors with screenings only). */
  directors: DirectorsBrowserItem[];
}

const DirectorsBrowser: React.FC<DirectorsBrowserProps> = ({ directors }) => {
  const [query, setQuery] = useState("");

  // Name search runs client-side over the full list, so it never triggers
  // an extra request. The unfiltered list is what the server renders.
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q
      ? directors.filter((director) => director.name.toLowerCase().includes(q))
      : directors;
  }, [directors, query]);

  return (
    <section className="px-6 md:px-12 lg:px-16 pb-24 md:pb-32">
      <div className="mb-10 md:mb-12">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
          <div className="relative flex items-center min-w-0 h-9 px-3 border-b border-white/15 focus-within:border-white/45 transition-colors md:w-80">
            <Search
              className="size-3.5 text-white/45 shrink-0 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Szukaj reżysera po nazwisku..."
              aria-label="Szukaj reżysera"
              className="ml-3 flex-1 min-w-0 bg-transparent text-[12px] tracking-wide text-white placeholder:text-white/50 outline-none"
            />
            {query.length > 0 && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Wyczyść wyszukiwanie"
                className="ml-2 text-white/40 hover:text-white transition-colors shrink-0"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
          <p className="text-[11px] uppercase tracking-wider text-white/50 md:ml-auto">
            {directors.length}{" "}
            {pluralPl(directors.length, "reżyser", "reżyserów", "reżyserów")}{" "}
            z&nbsp;nadchodzącymi seansami
          </p>
        </div>
        <div
          className="mt-8 md:mt-12 -mx-6 md:-mx-12 lg:-mx-16 h-px bg-white/10"
          aria-hidden="true"
        />
      </div>

      {visible.length === 0 ? (
        <EmptyState
          description={
            directors.length === 0 ? (
              <>
                Żaden reżyser nie ma teraz zapowiedzianych seansów. Zajrzyj
                ponownie wkrótce.
              </>
            ) : (
              <>
                Brak reżyserów pasujących do&nbsp;wyszukiwania. Spróbuj zmienić
                frazę.
              </>
            )
          }
        />
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 gap-x-3 gap-y-7 md:gap-x-4 md:gap-y-9">
          {visible.map((director) => (
            <DirectorCard key={director.id} director={director} />
          ))}
        </div>
      )}
    </section>
  );
};

export default DirectorsBrowser;
