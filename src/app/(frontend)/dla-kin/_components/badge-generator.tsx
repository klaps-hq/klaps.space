"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { Check, Copy } from "lucide-react";
import { SITE_URL } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export interface BadgeCinemaOption {
  slug: string;
  name: string;
  city: string;
}

interface BadgeGeneratorProps {
  cinemas: BadgeCinemaOption[];
}

type BadgeVariant = "ciemna" | "jasna";

const VARIANTS: { id: BadgeVariant; label: string }[] = [
  { id: "ciemna", label: "Ciemna" },
  { id: "jasna", label: "Jasna" },
];

const BADGE_WIDTH = 200;
const BADGE_HEIGHT = 52;
const MAX_RESULTS = 8;

// Case- and diacritics-insensitive matching, so "lodz" finds "Łódź".
const normalize = (value: string): string =>
  value.toLowerCase().replace(/ł/g, "l").normalize("NFD").replace(/[̀-ͯ]/g, "");

// The query string never changes while this page is open.
const subscribeToNothing = () => () => {};

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

/**
 * The snippet a cinema pastes into its own site. The link points at the
 * cinema's own page rather than the homepage: the venue promotes its own
 * listing, and the link carries the venue name as the image alt, which is
 * the anchor text search engines read for an image link.
 */
const buildSnippet = (
  cinema: BadgeCinemaOption | null,
  variant: BadgeVariant
): string => {
  const href = cinema ? `${SITE_URL}/kina/${cinema.slug}` : SITE_URL;
  const alt = cinema
    ? `${cinema.name}, ${cinema.city} - repertuar na klaps.space`
    : "Repertuar seansów specjalnych na klaps.space";
  return `<a href="${href}" title="${escapeHtml(alt)}"><img src="${SITE_URL}/badges/klaps-${variant}.svg" alt="${escapeHtml(alt)}" width="${BADGE_WIDTH}" height="${BADGE_HEIGHT}"></a>`;
};

const BadgeGenerator: React.FC<BadgeGeneratorProps> = ({ cinemas }) => {
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<BadgeCinemaOption | null>(null);
  const [variant, setVariant] = useState<BadgeVariant>("ciemna");
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  // `?kino=<slug>` preselects a venue, so a link sent to a cinema opens with
  // its code ready. Read from window instead of useSearchParams so the page
  // stays statically rendered without a Suspense boundary; the server
  // snapshot is empty, so hydration matches and the client fills it in.
  const search = useSyncExternalStore(
    subscribeToNothing,
    () => window.location.search,
    () => ""
  );
  const preselected = useMemo(() => {
    const slug = new URLSearchParams(search).get("kino");
    return slug
      ? (cinemas.find((cinema) => cinema.slug === slug) ?? null)
      : null;
  }, [cinemas, search]);
  const selected = picked ?? preselected;

  useEffect(
    () => () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    },
    []
  );

  const results = useMemo(() => {
    const needle = normalize(query.trim());
    if (needle.length < 2) return [];
    return cinemas
      .filter((cinema) =>
        normalize(`${cinema.name} ${cinema.city}`).includes(needle)
      )
      .slice(0, MAX_RESULTS);
  }, [cinemas, query]);

  const snippet = buildSnippet(selected, variant);

  const handleSelect = (cinema: BadgeCinemaOption) => {
    setPicked(cinema);
    setQuery("");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked (insecure context, permissions); the code
      // stays selectable in the block below.
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
      <div className="lg:col-span-5 flex flex-col gap-10">
        <div>
          <label
            htmlFor="badge-cinema-search"
            className="block text-[10px] md:text-xs uppercase tracking-[0.25em] text-white/50"
          >
            1. Wybierz kino
          </label>
          <input
            id="badge-cinema-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Nazwa kina lub miasto"
            autoComplete="off"
            className="mt-4 w-full bg-transparent border-b border-white/25 focus:border-white outline-none py-3 text-base md:text-lg text-white placeholder:text-white/35 transition-colors"
          />
          {results.length > 0 && (
            <ul className="mt-2 flex flex-col">
              {results.map((cinema) => (
                <li key={cinema.slug}>
                  <button
                    type="button"
                    onClick={() => handleSelect(cinema)}
                    className="w-full flex items-baseline justify-between gap-4 py-3 text-left border-b border-white/10 text-white/75 hover:text-white transition-colors"
                  >
                    <span className="text-base">{cinema.name}</span>
                    <span className="shrink-0 text-[10px] uppercase tracking-[0.22em] text-white/50">
                      {cinema.city}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {query.trim().length >= 2 && results.length === 0 && (
            <p className="mt-4 text-sm text-white/50">
              Nie znaleźliśmy takiego kina. Sprawdź pisownię albo napisz do nas.
            </p>
          )}
          <p
            className="mt-5 text-sm md:text-base text-white/65"
            aria-live="polite"
          >
            {selected ? (
              <>
                Wybrane: <span className="text-white">{selected.name}</span>,{" "}
                {selected.city}
              </>
            ) : (
              "Bez wybranego kina odznaka prowadzi na stronę główną Klapsa."
            )}
          </p>
        </div>

        <div>
          <span className="block text-[10px] md:text-xs uppercase tracking-[0.25em] text-white/50">
            2. Wybierz wersję
          </span>
          <div
            className="mt-4 flex gap-3"
            role="group"
            aria-label="Wersja odznaki"
          >
            {VARIANTS.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={variant === item.id}
                onClick={() => setVariant(item.id)}
                className={cn(
                  "px-5 py-2.5 text-xs uppercase tracking-[0.22em] border transition-colors",
                  variant === item.id
                    ? "border-white text-white"
                    : "border-white/20 text-white/55 hover:text-white hover:border-white/50"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-7 flex flex-col gap-6">
        <div
          className={cn(
            "flex items-center justify-center px-6 py-12 md:py-16 border border-white/10",
            // Each variant is shown on the kind of page it is meant for.
            variant === "ciemna" ? "bg-[#f2f2f2]" : "bg-[#111111]"
          )}
        >
          {/* Plain <img>: this previews the exact file cinemas embed. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/badges/klaps-${variant}.svg`}
            alt="Podgląd odznaki klaps.space"
            width={BADGE_WIDTH}
            height={BADGE_HEIGHT}
          />
        </div>

        <div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-white/50">
              3. Skopiuj kod i wklej na stronę kina
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="shrink-0 inline-flex items-center gap-2 min-h-11 px-4 whitespace-nowrap text-xs uppercase tracking-[0.22em] text-white border border-white/25 hover:border-white transition-colors"
            >
              {copied ? (
                <Check aria-hidden="true" className="size-4" />
              ) : (
                <Copy aria-hidden="true" className="size-4" />
              )}
              {copied ? "Skopiowano" : "Kopiuj kod"}
            </button>
          </div>
          <pre className="mt-4 p-5 bg-white/[0.04] border border-white/10 text-xs md:text-sm text-white/80 leading-relaxed whitespace-pre-wrap break-all select-all">
            <code>{snippet}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default BadgeGenerator;
