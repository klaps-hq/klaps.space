"use client";

import React, { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Star } from "lucide-react";
import { useMyCinemas } from "@/hooks/use-my-cinemas";
import { useScreeningsTransition } from "@/contexts/screenings-transition-context";
import { cn } from "@/lib/utils";

export const MY_CINEMAS_PARAM = "moje";

interface MyCinemasFieldProps {
  className?: string;
}

// "Moje kina" filter chip. Hidden until the visitor has starred a cinema,
// except when the URL already asks for the view (a shared or stale link),
// so it can always be switched off.
const MyCinemasField: React.FC<MyCinemasFieldProps> = ({ className }) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { startTransition } = useScreeningsTransition();
  const { cinemas, isHydrated } = useMyCinemas();

  const active = searchParams.get(MY_CINEMAS_PARAM) === "1";

  const toggle = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (active) params.delete(MY_CINEMAS_PARAM);
    else params.set(MY_CINEMAS_PARAM, "1");
    params.delete("page");
    const qs = params.toString();
    startTransition(() => {
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  }, [active, searchParams, pathname, router, startTransition]);

  if (!active && (!isHydrated || cinemas.length === 0)) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center justify-center gap-2 h-9 px-3.5 border text-[11px] uppercase tracking-wider transition-colors whitespace-nowrap",
        active
          ? "border-white text-white"
          : "border-white/25 text-white/80 hover:border-white/60 hover:text-white",
        className
      )}
    >
      <Star
        aria-hidden="true"
        className={cn("size-3 shrink-0", active && "fill-white")}
      />
      Moje kina{cinemas.length > 0 ? ` (${cinemas.length})` : ""}
    </button>
  );
};

export default MyCinemasField;
