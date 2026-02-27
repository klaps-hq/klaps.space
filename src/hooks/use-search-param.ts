"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useScreeningsTransition } from "@/contexts/screenings-transition-context";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

const SEARCH_PARAM_KEY = "search";
const SEARCH_DEBOUNCE_DELAY_MS = 500;

interface UseSearchParamReturn {
  searchQuery: string;
  handleSearchChange: (value: string) => void;
}

export const useSearchParam = (): UseSearchParamReturn => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { startTransition } = useScreeningsTransition();

  const searchParamValue = searchParams.get(SEARCH_PARAM_KEY) ?? "";
  const prevSearchParamValueRef = useRef(searchParamValue);

  const [searchQuery, setSearchQuery] = useState(searchParamValue);
  const debouncedSearchQuery = useDebouncedValue(searchQuery, {
    delayMs: SEARCH_DEBOUNCE_DELAY_MS,
  });

  if (prevSearchParamValueRef.current !== searchParamValue) {
    prevSearchParamValueRef.current = searchParamValue;
    setSearchQuery(searchParamValue);
  }

  useEffect(() => {
    const trimmed = debouncedSearchQuery.trim();
    const currentParam = searchParamValue.trim();

    if (trimmed === currentParam) return;

    const params = new URLSearchParams(searchParams.toString());

    if (trimmed) {
      params.set(SEARCH_PARAM_KEY, trimmed);
    } else {
      params.delete(SEARCH_PARAM_KEY);
    }

    params.delete("page");

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

    startTransition(() => {
      router.replace(newUrl, { scroll: false });
    });
  }, [
    debouncedSearchQuery,
    pathname,
    router,
    searchParamValue,
    searchParams,
    startTransition,
  ]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  return { searchQuery, handleSearchChange };
};
