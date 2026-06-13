"use client";

import React, { useEffect, useRef, useState } from "react";
import { Check, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
  title: string;
  url: string;
  text?: string;
  /**
   * "default" renders a bordered labeled button, "compact" an icon-only
   * one, "labeled" a flat icon + label button with a tall touch target.
   */
  variant?: "default" | "compact" | "labeled";
  className?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({
  title,
  url,
  text,
  variant = "default",
  className,
}) => {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    },
    []
  );

  const handleShare = async () => {
    // Prefer the native share sheet (mostly mobile browsers).
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (error) {
        // User dismissed the share sheet - nothing to do.
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        // Sharing failed for another reason - fall through to copying.
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (e.g. insecure context) - silently ignore.
    }
  };

  if (variant === "labeled") {
    return (
      <button
        type="button"
        onClick={handleShare}
        aria-label={`Udostępnij: ${title}`}
        className={cn(
          // min-h-11 = 44px tap target for the mobile action column.
          "inline-flex items-center min-h-11 gap-2 py-2 text-[10px] uppercase tracking-[0.2em] text-white/70 hover:text-white transition-colors",
          copied && "text-white",
          className
        )}
      >
        {copied ? (
          <Check aria-hidden="true" className="w-4 h-4" />
        ) : (
          <Share2 aria-hidden="true" className="w-4 h-4" />
        )}
        <span aria-live="polite">
          {copied ? "Skopiowano link" : "Udostępnij"}
        </span>
      </button>
    );
  }

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={handleShare}
        aria-label={`Udostępnij: ${title}`}
        title={copied ? "Skopiowano link" : "Udostępnij"}
        className={cn(
          // p-3.5/-m-3.5 around the 16px icon = 44px tap target with no
          // visual change.
          "p-3.5 -m-3.5 text-white/40 hover:text-white transition-colors",
          copied && "text-white",
          className
        )}
      >
        {copied ? (
          <Check aria-hidden="true" className="w-4 h-4" />
        ) : (
          <Share2 aria-hidden="true" className="w-4 h-4" />
        )}
        <span aria-live="polite" className="sr-only">
          {copied ? "Skopiowano link" : ""}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label={`Udostępnij: ${title}`}
      className={cn(
        "group inline-flex w-fit items-center gap-3 border border-white/30 hover:border-white hover:bg-white/[0.06] px-6 md:px-8 py-3 md:py-3.5 text-[11px] md:text-xs uppercase tracking-[0.28em] text-white transition-colors",
        className
      )}
    >
      {copied ? (
        <Check
          aria-hidden="true"
          className="w-3.5 h-3.5 transition-transform group-hover:scale-110"
        />
      ) : (
        <Share2
          aria-hidden="true"
          className="w-3.5 h-3.5 transition-transform group-hover:scale-110"
        />
      )}
      <span aria-live="polite">
        {copied ? "Skopiowano link" : "Udostępnij"}
      </span>
    </button>
  );
};

export default ShareButton;
