"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useScreeningsTransition } from "@/contexts/screenings-transition-context";

const SEARCH_PARAM_KEY = "search";
const DEBOUNCE_DELAY = 300;

interface UseSearchParamReturn {
  searchQuery: string;
  handleSearchChange: (value: string) => void;
}

export const useSearchParam = (): UseSearchParamReturn => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { startTransition } = useScreeningsTransition();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const paramValue = searchParams.get(SEARCH_PARAM_KEY) ?? "";
  const [pendingSearchQuery, setPendingSearchQuery] = useState(paramValue);
  const [isDebouncing, setIsDebouncing] = useState(false);
  const searchQuery = isDebouncing ? pendingSearchQuery : paramValue;

  useEffect(() => {
    return () => {
      if (!timeoutRef.current) return;
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    };
  }, []);

  const handleSearchChange = useCallback(
    (value: string) => {
      setPendingSearchQuery(value);
      setIsDebouncing(true);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        setIsDebouncing(false);

        const params = new URLSearchParams(searchParams.toString());

        if (value.trim()) {
          params.set(SEARCH_PARAM_KEY, value.trim());
        } else {
          params.delete(SEARCH_PARAM_KEY);
        }

        params.delete("page");

        const queryString = params.toString();
        const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

        startTransition(() => {
          router.replace(newUrl, { scroll: false });
        });
      }, DEBOUNCE_DELAY);
    },
    [searchParams, pathname, router, startTransition]
  );

  return { searchQuery, handleSearchChange };
};
