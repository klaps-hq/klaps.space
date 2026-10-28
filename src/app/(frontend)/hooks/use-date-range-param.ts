"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { formatDateLabel, getDateString } from "@/lib/utils";
import { useScreeningsTransition } from "@/contexts/screenings-transition-context";
import { trackEvent } from "@/lib/analytics";

const DATE_FROM_KEY = "dateFrom";
const DATE_TO_KEY = "dateTo";
const DAYS_TO_RENDER = 5;

interface DateOption {
  value: string;
  label: string;
}

interface DateRangeOption {
  from: string;
  to: string;
}

// Shifts a YYYY-MM-DD calendar date by whole days. Parsed as UTC so the
// arithmetic never crosses a DST boundary.
const addDays = (isoDate: string, days: number): string => {
  const d = new Date(`${isoDate}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
};

/**
 * Friday to Sunday of the current weekend, or of the next one on weekdays.
 * Friday counts as weekend: special screenings cluster on Friday evenings.
 * From Friday on, the range starts today so past days are never selected.
 */
export const getWeekendRange = (now: Date = new Date()): DateRangeOption => {
  const today = getDateString(now);
  const weekday = new Date(`${today}T00:00:00Z`).getUTCDay();
  // Sunday is 0: the weekend ends today.
  if (weekday === 0) return { from: today, to: today };
  const daysToFriday = Math.max(5 - weekday, 0);
  return { from: addDays(today, daysToFriday), to: addDays(today, 7 - weekday) };
};

interface UseDateRangeParamReturn {
  dateFrom: string | null;
  dateTo: string | null;
  isRange: boolean;
  selectedDay: string | null;
  dayOptions: DateOption[];
  weekend: DateRangeOption;
  isWeekend: boolean;
  handleWeekendClick: () => void;
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
        trackEvent("filter_change", {
          filter_type: "date",
          filter_value: "day",
        });
        updateUrl(value, value);
      }
    },
    [selectedDay, updateUrl]
  );

  const weekend = useMemo(() => getWeekendRange(), []);
  const isWeekend = dateFrom === weekend.from && dateTo === weekend.to;

  const handleWeekendClick = useCallback(() => {
    if (isWeekend) {
      updateUrl(null, null);
      return;
    }
    trackEvent("filter_change", {
      filter_type: "date",
      filter_value: "weekend",
    });
    updateUrl(weekend.from, weekend.to);
  }, [isWeekend, weekend, updateUrl]);

  const handleRangeChange = useCallback(
    (from: string, to: string) => {
      trackEvent("filter_change", {
        filter_type: "date",
        filter_value: "range",
      });
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
    weekend,
    isWeekend,
    handleWeekendClick,
    handleDayClick,
    handleRangeChange,
    handleClearDate,
  };
};
