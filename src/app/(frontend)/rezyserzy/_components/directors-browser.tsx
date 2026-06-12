"use client";

import React, { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { IDirector } from "@/interfaces/IDirectors";
import { cn } from "@/lib/utils";
import EmptyState from "@/components/common/empty-state";
import PaginatedNav from "@/components/common/paginated-nav";
import DirectorCard from "./director-card";

interface DirectorsBrowserProps {
  /** Pre-sorted server-side (directors with upcoming screenings first). */
  directors: IDirector[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

const buildPageHref = (page: number): string =>
  page <= 1 ? "/rezyserzy" : `/rezyserzy?page=${page}`;

const DirectorsBrowser: React.FC<DirectorsBrowserProps> = ({
  directors,
  currentPage,
  totalPages,
  pageSize,
}) => {
  const [query, setQuery] = useState("");
  const [onlyUpcoming, setOnlyUpcoming] = useState(false);

  // Name search and the "upcoming only" toggle run client-side over the full
  // list, so neither triggers an extra request. While either is active the
  // URL-based pagination is suspended and all matches show at once.
  const isFiltering = query.trim().length > 0 || onlyUpcoming;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return directors.filter((director) => {
      if (onlyUpcoming && director.upcomingScreeningsCount === 0) return false;
      if (q && !director.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [directors, query, onlyUpcoming]);

  const visible = useMemo(
    () =>
      isFiltering
        ? filtered
        : filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [filtered, isFiltering, currentPage, pageSize]
  );

  const upcomingCount = useMemo(
    () => directors.filter((d) => d.upcomingScreeningsCount > 0).length,
    [directors]
  );

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

          {upcomingCount > 0 && (
            <button
              type="button"
              onClick={() => setOnlyUpcoming((value) => !value)}
              aria-pressed={onlyUpcoming}
              className={cn(
                "inline-flex items-center justify-between gap-2.5 h-9 px-3.5 border text-[11px] uppercase tracking-wider transition-colors whitespace-nowrap md:ml-auto",
                onlyUpcoming
                  ? "border-white text-white"
                  : "border-white/25 text-white/80 hover:border-white/60 hover:text-white"
              )}
            >
              Tylko z&nbsp;nadchodzącymi seansami
              <span className="text-white/50">{upcomingCount}</span>
            </button>
          )}
        </div>
        <div
          className="mt-8 md:mt-12 -mx-6 md:-mx-12 lg:-mx-16 h-px bg-white/10"
          aria-hidden="true"
        />
      </div>

      {visible.length === 0 ? (
        <EmptyState
          description={
            <>
              Brak reżyserów pasujących do&nbsp;wyszukiwania. Spróbuj zmienić
              frazę.
            </>
          }
        />
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 gap-x-3 gap-y-7 md:gap-x-4 md:gap-y-9">
          {visible.map((director) => (
            <DirectorCard key={director.id} director={director} />
          ))}
        </div>
      )}

      {!isFiltering && totalPages > 1 && (
        <div className="mt-16 md:mt-20">
          <PaginatedNav
            currentPage={currentPage}
            totalPages={totalPages}
            buildHref={buildPageHref}
          />
        </div>
      )}
    </section>
  );
};

export default DirectorsBrowser;
