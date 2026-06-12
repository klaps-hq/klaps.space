"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { ISearchResults } from "@/interfaces/ISearch";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { cn } from "@/lib/utils";

const MIN_QUERY_LENGTH = 2;
const SEARCH_DEBOUNCE_DELAY_MS = 300;

const EMPTY_RESULTS: ISearchResults = { cities: [], cinemas: [] };

type SiteSearchMode = "cities" | "cinemas";

const MODE_COPY: Record<
  SiteSearchMode,
  { placeholder: string; ariaLabel: string }
> = {
  cities: { placeholder: "Szukaj miasta...", ariaLabel: "Szukaj miasta" },
  cinemas: { placeholder: "Szukaj kina...", ariaLabel: "Szukaj kina" },
};

interface SiteSearchProps {
  mode: SiteSearchMode;
  className?: string;
}

const SiteSearch: React.FC<SiteSearchProps> = ({ mode, className }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ISearchResults>(EMPTY_RESULTS);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebouncedValue(query, {
    delayMs: SEARCH_DEBOUNCE_DELAY_MS,
  });

  const close = useCallback(() => setIsOpen(false), []);

  const reset = useCallback(() => {
    setQuery("");
    setResults(EMPTY_RESULTS);
    setIsOpen(false);
  }, []);

  // Fetch results when the debounced query changes; abort stale requests.
  // Loading state transitions happen in the input onChange handler and in
  // fetch callbacks, so the effect never sets state synchronously.
  useEffect(() => {
    const trimmed = debouncedQuery.trim();

    if (trimmed.length < MIN_QUERY_LENGTH) {
      return;
    }

    const controller = new AbortController();

    fetch(`/api/search?query=${encodeURIComponent(trimmed)}`, {
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : EMPTY_RESULTS))
      .then((data: ISearchResults) => {
        setResults(data);
        setIsLoading(false);
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        setResults(EMPTY_RESULTS);
        setIsLoading(false);
      });

    return () => controller.abort();
  }, [debouncedQuery]);

  // Click outside the search closes the dropdown.
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        close();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () =>
      document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen, close]);

  // API returns cities sorted by size and cinemas alphabetically - keep the order.
  const items = mode === "cities" ? results.cities : results.cinemas;
  const trimmedQuery = query.trim();
  const hasQuery = trimmedQuery.length >= MIN_QUERY_LENGTH;
  const showDropdown = isOpen && hasQuery;

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="flex items-center h-9 px-3 border-b border-white/15 focus-within:border-white/45 transition-colors">
        <Search
          className="size-3.5 text-white/45 shrink-0 pointer-events-none"
          aria-hidden="true"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            const value = e.target.value;
            const trimmed = value.trim();
            setQuery(value);
            setIsOpen(true);
            if (trimmed.length < MIN_QUERY_LENGTH) {
              setResults(EMPTY_RESULTS);
              setIsLoading(false);
            } else if (trimmed !== debouncedQuery.trim()) {
              // The debounced value will change and trigger a fetch;
              // show the loading state already during the debounce window.
              setIsLoading(true);
            }
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape") close();
          }}
          placeholder={MODE_COPY[mode].placeholder}
          aria-label={MODE_COPY[mode].ariaLabel}
          className="ml-3 flex-1 min-w-0 bg-transparent text-[12px] tracking-wide text-white placeholder:text-white/50 outline-none"
        />
        {query.length > 0 && (
          <button
            type="button"
            onClick={reset}
            aria-label="Wyczyść wyszukiwanie"
            className="ml-2 text-white/40 hover:text-white transition-colors shrink-0"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute left-0 right-0 top-full mt-2 max-h-[50vh] overflow-y-auto bg-black border border-white/10 py-2 z-50">
          {items.length === 0 && (
            <p className="px-4 py-3 text-[12px] text-white/50">
              {isLoading ? "Szukam..." : "Brak wyników."}
            </p>
          )}

          {mode === "cities" && results.cities.length > 0 && (
            <ul>
              {results.cities.map((city) => (
                <li key={city.id}>
                  <Link
                    href={`/miasta/${city.slug}`}
                    onClick={reset}
                    className="block px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/[0.04] transition-colors"
                  >
                    {city.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {mode === "cinemas" && results.cinemas.length > 0 && (
            <ul>
              {results.cinemas.map((cinema) => (
                <li key={cinema.id}>
                  <Link
                    href={`/kina/${cinema.slug}`}
                    onClick={reset}
                    className="group block px-4 py-2 hover:bg-white/[0.04] transition-colors"
                  >
                    <span className="block text-sm text-white/70 group-hover:text-white transition-colors">
                      {cinema.name}
                    </span>
                    <span className="block text-[10px] uppercase tracking-[0.22em] text-white/50">
                      {cinema.city.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default SiteSearch;
