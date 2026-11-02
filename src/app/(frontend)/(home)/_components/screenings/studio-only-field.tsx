"use client";

import React, { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useScreeningsTransition } from "@/contexts/screenings-transition-context";
import { STUDIO_ONLY_PARAM } from "@/lib/screening-filters";
import { cn } from "@/lib/utils";

interface StudioOnlyFieldProps {
  className?: string;
}

// "Tylko kina studyjne" chip: hides screenings in chain multiplexes. Listings
// keep them (after the independents) because a film's re-release is often
// only there, but a visitor after the arthouse programme can drop them.
const StudioOnlyField: React.FC<StudioOnlyFieldProps> = ({ className }) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { startTransition } = useScreeningsTransition();

  const active = searchParams.get(STUDIO_ONLY_PARAM) === "1";

  const toggle = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (active) params.delete(STUDIO_ONLY_PARAM);
    else params.set(STUDIO_ONLY_PARAM, "1");
    params.delete("page");
    const qs = params.toString();
    startTransition(() => {
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  }, [active, searchParams, pathname, router, startTransition]);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center justify-center h-9 px-3.5 border text-[11px] uppercase tracking-wider transition-colors whitespace-nowrap",
        active
          ? "border-white text-white"
          : "border-white/25 text-white/80 hover:border-white/60 hover:text-white",
        className
      )}
    >
      Tylko kina studyjne
    </button>
  );
};

export default StudioOnlyField;
