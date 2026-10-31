"use client";

import React, { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import type { BadgeTheme } from "@/lib/cinema-of-the-month";
import { cn } from "@/lib/utils";

/** One awarded cinema with its badge paths and snippets, built on the server. */
export interface CinemaBadgeOption {
  slug: string;
  name: string;
  rank: number;
  src: Record<BadgeTheme, string>;
  snippet: Record<BadgeTheme, string>;
}

interface CinemaBadgeCodeProps {
  badges: CinemaBadgeOption[];
  width: number;
  height: number;
}

const THEMES: { id: BadgeTheme; label: string }[] = [
  { id: "dark", label: "Ciemna" },
  { id: "light", label: "Jasna" },
];

const LABEL_CLASS =
  "text-[10px] md:text-xs uppercase tracking-[0.25em] text-white/50";

const toggleClass = (active: boolean) =>
  cn(
    "text-xs uppercase tracking-[0.22em] transition-colors",
    active ? "text-white" : "text-white/35 hover:text-white/70"
  );

const CinemaBadgeCode: React.FC<CinemaBadgeCodeProps> = ({
  badges,
  width,
  height,
}) => {
  const [slug, setSlug] = useState(badges[0]?.slug);
  const [theme, setTheme] = useState<BadgeTheme>("dark");
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    },
    []
  );

  const selected = badges.find((badge) => badge.slug === slug) ?? badges[0];
  if (!selected) return null;
  const snippet = selected.snippet[theme];

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
    <div className="flex flex-col gap-10 md:gap-12">
      <div>
        <span className={LABEL_CLASS}>Kino</span>
        <div
          className="mt-3 flex flex-wrap gap-x-5 gap-y-2"
          role="group"
          aria-label="Kino, dla którego pokazać odznakę"
        >
          {badges.map((badge) => (
            <button
              key={badge.slug}
              type="button"
              aria-pressed={badge.slug === selected.slug}
              onClick={() => setSlug(badge.slug)}
              className={cn(
                toggleClass(badge.slug === selected.slug),
                "min-h-11 text-left"
              )}
            >
              {badge.rank}. {badge.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-baseline justify-between gap-4">
          <span className={LABEL_CLASS}>Podgląd</span>
          <div className="flex gap-5" role="group" aria-label="Wersja odznaki">
            {THEMES.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={theme === item.id}
                onClick={() => setTheme(item.id)}
                className={toggleClass(theme === item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div
          className={cn(
            "mt-4 flex items-center justify-center px-6 py-14 md:py-20 transition-colors duration-300",
            // Each variant is shown on the kind of page it is meant for.
            theme === "dark" ? "bg-[#f2f2f2]" : "bg-[#141414]"
          )}
        >
          {/* Plain <img>: this previews the exact file cinemas embed. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={selected.src[theme]}
            alt={`Podgląd odznaki Kino klasyki miesiąca dla kina ${selected.name}`}
            width={width}
            height={height}
            className="max-w-full h-auto"
          />
        </div>
      </div>

      <div>
        <div className="flex items-baseline justify-between gap-4">
          <span className={LABEL_CLASS}>Kod</span>
          <button
            type="button"
            onClick={handleCopy}
            className="shrink-0 inline-flex items-center gap-2 min-h-11 -my-3 whitespace-nowrap text-xs uppercase tracking-[0.22em] text-white/70 hover:text-white transition-colors"
          >
            {copied ? (
              <Check aria-hidden="true" className="size-4" />
            ) : (
              <Copy aria-hidden="true" className="size-4" />
            )}
            {copied ? "Skopiowano" : "Kopiuj kod"}
          </button>
        </div>
        <pre className="mt-4 p-5 md:p-6 bg-white/[0.04] font-mono text-xs md:text-sm text-white/70 leading-relaxed whitespace-pre-wrap break-all select-all">
          <code>{snippet}</code>
        </pre>
      </div>
    </div>
  );
};

export default CinemaBadgeCode;
