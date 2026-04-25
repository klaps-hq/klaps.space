"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { formatDateLabel, getDateString } from "@/lib/utils";
import { useScreeningsTransition } from "@/contexts/screenings-transition-context";

const DATE_FROM_KEY = "dateFrom";
const DATE_TO_KEY = "dateTo";
const DAYS_TO_RENDER = 7;

interface DateOption {
  value: string;
  label: string;
}

interface UseDateRangeParamReturn {
  dateFrom: string | null;
  dateTo: string | null;
  isRange: boolean;
  selectedDay: string | null;
  dayOptions: DateOption[];
  handleDayClick: (value: string) => void;
  handleRangeChange: (from: string, to: string) => void;
  handleClearDate: () => void;
}

export const useDateRangeParam = (): UseDateRangeParamReturn => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { startTransition } = useScreeningsTransition();

  const dateFrom = searchParams.get(DATE_FROM_KEY);
  const dateTo = searchParams.get(DATE_TO_KEY);

  const isRange = dateFrom !== null && dateTo !== null && dateFrom !== dateTo;
  const selectedDay = !isRange && dateFrom ? dateFrom : null;

  const dayOptions = useMemo<DateOption[]>(() => {
    const today = new Date();
    return Array.from({ length: DAYS_TO_RENDER }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const v = getDateString(d);
      return { value: v, label: formatDateLabel(v) };
    });
  }, []);

  const updateUrl = useCallback(
    (from: string | null, to: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (from) params.set(DATE_FROM_KEY, from);
      else params.delete(DATE_FROM_KEY);
      if (to) params.set(DATE_TO_KEY, to);
      else params.delete(DATE_TO_KEY);
      params.delete("page");
      const qs = params.toString();
      const url = qs ? `${pathname}?${qs}` : pathname;
      startTransition(() => {
        router.replace(url, { scroll: false });
      });
    },
    [searchParams, pathname, router, startTransition]
  );

  const handleDayClick = useCallback(
    (value: string) => {
      if (selectedDay === value) {
        updateUrl(null, null);
      } else {
        updateUrl(value, value);
      }
    },
    [selectedDay, updateUrl]
  );

  const handleRangeChange = useCallback(
    (from: string, to: string) => {
      updateUrl(from, to);
    },
    [updateUrl]
  );

  const handleClearDate = useCallback(() => {
    updateUrl(null, null);
  }, [updateUrl]);

  return {
    dateFrom,
    dateTo,
    isRange,
    selectedDay,
    dayOptions,
    handleDayClick,
    handleRangeChange,
    handleClearDate,
  };
};
