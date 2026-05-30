"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { IGenre } from "@/interfaces/IMovies";
import { useScreeningsTransition } from "@/contexts/screenings-transition-context";

const GENRES_PARAM_KEY = "genres";

interface GenreOption {
  value: number;
  label: string;
}

interface UseMultiGenreParamReturn {
  selectedGenreIds: number[];
  selectedCsv: string;
  options: GenreOption[];
  toggleGenre: (id: number) => void;
  clearGenres: () => void;
  isSelected: (id: number) => boolean;
}

export const useMultiGenreParam = (
  genres: IGenre[]
): UseMultiGenreParamReturn => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { startTransition } = useScreeningsTransition();

  const options = useMemo<GenreOption[]>(
    () => genres.map((g) => ({ value: g.id, label: g.name })),
    [genres]
  );

  const selectedGenreIds = useMemo(() => {
    const raw = searchParams.get(GENRES_PARAM_KEY);
    if (!raw) return [];
    return raw
      .split(",")
      .map((v) => Number(v.trim()))
      .filter((v) => !Number.isNaN(v) && options.some((o) => o.value === v));
  }, [searchParams, options]);

  const selectedCsv = selectedGenreIds.join(",");

  const updateUrl = useCallback(
    (ids: number[]) => {
      const params = new URLSearchParams(searchParams.toString());
      if (ids.length === 0) {
        params.delete(GENRES_PARAM_KEY);
      } else {
        params.set(GENRES_PARAM_KEY, ids.join(","));
      }
      params.delete("page");
      const qs = params.toString();
      const url = qs ? `${pathname}?${qs}` : pathname;
      startTransition(() => {
        router.replace(url, { scroll: false });
      });
    },
    [searchParams, pathname, router, startTransition]
  );

  const toggleGenre = useCallback(
    (id: number) => {
      const next = selectedGenreIds.includes(id)
        ? selectedGenreIds.filter((g) => g !== id)
        : [...selectedGenreIds, id];
      updateUrl(next);
    },
    [selectedGenreIds, updateUrl]
  );

  const clearGenres = useCallback(() => {
    updateUrl([]);
  }, [updateUrl]);

  const isSelected = useCallback(
    (id: number) => selectedGenreIds.includes(id),
    [selectedGenreIds]
  );

  return {
    selectedGenreIds,
    selectedCsv,
    options,
    toggleGenre,
    clearGenres,
    isSelected,
  };
};
