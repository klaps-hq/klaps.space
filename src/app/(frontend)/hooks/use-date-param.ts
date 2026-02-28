"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { formatDateLabel } from "@/lib/utils";
import { useScreeningsTransition } from "@/contexts/screenings-transition-context";

const DATE_FROM_PARAM_KEY = "dateFrom";
const DATE_TO_PARAM_KEY = "dateTo";
const DAYS_TO_RENDER = 7;

type DateOption = {
  value: string;
  label: string;
};

interface UseDateParamReturn {
  dateFrom: string | null;
  dateTo: string | null;
  handleDateChange: (value: string | null) => void;
  daysOptions: DateOption[];
}

export const useDateParam = (): UseDateParamReturn => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { startTransition } = useScreeningsTransition();

  const todayString = new Date().toISOString().split("T")[0];

  const dateFrom = searchParams.get(DATE_FROM_PARAM_KEY) ?? todayString;
  const dateTo = searchParams.get(DATE_TO_PARAM_KEY) ?? todayString;

  const daysRange = useMemo(() => {
    const today = new Date();
    return Array.from({ length: DAYS_TO_RENDER }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() + index);
      const dateString = date.toISOString().split("T")[0];
      return {
        value: dateString,
        label: formatDateLabel(dateString),
      };
    });
  }, []);

  const handleDateChange = useCallback(
    (value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(DATE_FROM_PARAM_KEY, value ?? "");
      params.set(DATE_TO_PARAM_KEY, value ?? "");

      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

      startTransition(() => {
        router.replace(newUrl, { scroll: false });
      });
    },
    [searchParams, pathname, router, startTransition]
  );

  return { dateFrom, dateTo, daysOptions: daysRange, handleDateChange };
};
