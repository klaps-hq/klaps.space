"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { ICity } from "@/interfaces/ICities";
import { useScreeningsTransition } from "@/contexts/screenings-transition-context";

export type CityOption = { value: number | null; label: string };

const ALL_CITIES_OPTION: CityOption = {
  value: null,
  label: "Wszystkie miasta",
};

const CITY_PARAM_KEY = "city";

interface UseCityParamReturn {
  selectedCity: CityOption | null;
  handleCityChange: (option: CityOption | null) => void;
  options: CityOption[];
}

export const useCityParam = (cities: ICity[]): UseCityParamReturn => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { startTransition } = useScreeningsTransition();

  const options = useMemo<CityOption[]>(
    () => [
      ALL_CITIES_OPTION,
      ...cities.map((c) => ({ value: c.id, label: c.name })),
    ],
    [cities]
  );

  const selectedCity = useMemo(() => {
    const cityParam = searchParams.get(CITY_PARAM_KEY);
    if (!cityParam) return null;

    return options.find((o) => o.value?.toString() === cityParam) ?? null;
  }, [options, searchParams]);

  const handleCityChange = useCallback(
    (option: CityOption | null) => {
      const cityValue = option?.value;
      const params = new URLSearchParams(searchParams.toString());

      if (!cityValue) {
        params.delete(CITY_PARAM_KEY);
      } else {
        params.set(CITY_PARAM_KEY, cityValue.toString());
      }

      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

      startTransition(() => {
        router.replace(newUrl, { scroll: false });
      });

      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    },
    [searchParams, pathname, router, startTransition]
  );

  return {
    selectedCity,
    handleCityChange,
    options,
  };
};
