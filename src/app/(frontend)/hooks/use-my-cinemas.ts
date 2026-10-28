"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "my_cinemas";
// Each saved cinema costs one upstream call on the "Moje kina" view.
export const MAX_MY_CINEMAS = 20;

export interface SavedCinema {
  id: number;
  slug: string;
  name: string;
  cityName: string;
}

const EMPTY: SavedCinema[] = [];
let cache: SavedCinema[] | null = null;
const listeners = new Set<() => void>();

const isSavedCinema = (value: unknown): value is SavedCinema => {
  const v = value as SavedCinema;
  return (
    typeof v?.id === "number" &&
    typeof v.slug === "string" &&
    typeof v.name === "string" &&
    typeof v.cityName === "string"
  );
};

// Storage can throw (private mode, blocked site data) or hold anything;
// both read as "nothing saved".
const read = (): SavedCinema[] => {
  if (cache) return cache;
  try {
    const parsed: unknown = JSON.parse(
      window.localStorage.getItem(STORAGE_KEY) ?? "[]"
    );
    cache = Array.isArray(parsed) ? parsed.filter(isSavedCinema) : EMPTY;
  } catch {
    cache = EMPTY;
  }
  return cache;
};

const write = (next: SavedCinema[]) => {
  cache = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Kept in memory for this tab only.
  }
  listeners.forEach((notify) => notify());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  // Another tab saving a cinema updates this one too.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    cache = null;
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
};

interface UseMyCinemasReturn {
  cinemas: SavedCinema[];
  /** False on the server and during hydration, when the list reads empty. */
  isHydrated: boolean;
  isSaved: (id: number) => boolean;
  toggle: (cinema: SavedCinema) => void;
}

const getServerSnapshot = () => null;

/** Cinemas the visitor starred, kept per browser in localStorage. */
export const useMyCinemas = (): UseMyCinemasReturn => {
  const snapshot = useSyncExternalStore(subscribe, read, getServerSnapshot);
  const cinemas = snapshot ?? EMPTY;

  const isSaved = useCallback(
    (id: number) => cinemas.some((c) => c.id === id),
    [cinemas]
  );

  const toggle = useCallback((cinema: SavedCinema) => {
    const current = read();
    const next = current.some((c) => c.id === cinema.id)
      ? current.filter((c) => c.id !== cinema.id)
      : [...current, cinema].slice(-MAX_MY_CINEMAS);
    write(next);
  }, []);

  return { cinemas, isHydrated: snapshot !== null, isSaved, toggle };
};
