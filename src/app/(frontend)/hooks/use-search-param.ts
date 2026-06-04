"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useScreeningsTransition } from "@/contexts/screenings-transition-context";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

const SEARCH_PARAM_KEY = "search";
const SEARCH_DEBOUNCE_DELAY_MS = 400;

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

  const [searchQuery, setSearchQuery] = useState(searchParamValue);
  const debouncedSearchQuery = useDebouncedValue(searchQuery, {
    delayMs: SEARCH_DEBOUNCE_DELAY_MS,
  });
  const isUserInputRef = useRef(false);

  useEffect(() => {
    if (searchParamValue !== searchQuery) {
      isUserInputRef.current = false;
      setSearchQuery(searchParamValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync only when URL param changes externally
  }, [searchParamValue]);

  useEffect(() => {
    if (!isUserInputRef.current) return;

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
    isUserInputRef.current = true;
    setSearchQuery(value);
  }, []);

  return { searchQuery, handleSearchChange };
};
