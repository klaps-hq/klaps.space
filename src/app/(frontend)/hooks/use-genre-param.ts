"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { IGenre } from "@/interfaces/IMovies";
import { useScreeningsTransition } from "@/contexts/screenings-transition-context";

const GENRE_PARAM_KEY = "genre";
const ALL_GENRES_LABEL = "Wszystkie";

interface GenreRadioOption {
  value: string;
  label: string;
}

interface UseGenreParamReturn {
  selectedGenre: string;
  handleGenreChange: (value: string) => void;
  options: GenreRadioOption[];
}

export const useGenreParam = (genres: IGenre[]): UseGenreParamReturn => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { startTransition } = useScreeningsTransition();

  const options = useMemo<GenreRadioOption[]>(
    () => [
      { value: "", label: ALL_GENRES_LABEL },
      ...genres.map((g) => ({ value: g.id.toString(), label: g.name })),
    ],
    [genres]
  );

  const selectedGenre = useMemo(() => {
    const genreParam = searchParams.get(GENRE_PARAM_KEY);
    if (!genreParam) return "";
    const match = options.find((o) => o.value === genreParam);
    return match ? match.value : "";
  }, [options, searchParams]);

  const handleGenreChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (!value) {
        params.delete(GENRE_PARAM_KEY);
      } else {
        params.set(GENRE_PARAM_KEY, value);
      }
      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
      startTransition(() => {
        router.replace(newUrl, { scroll: false });
      });
    },
    [searchParams, pathname, router, startTransition]
  );

  return {
    selectedGenre,
    handleGenreChange,
    options,
  };
};
