"use client";

import { useSyncExternalStore } from "react";

// Coarse clock shared by every subscriber: screening listings only need
// to notice when a showtime has passed, so a one-minute tick is plenty.
const TICK_MS = 60_000;

let now = Date.now();
const listeners = new Set<() => void>();
let intervalId: ReturnType<typeof setInterval> | undefined;

const subscribe = (listener: () => void) => {
  // The value may be stale if nothing was subscribed for a while; React
  // re-reads the snapshot right after subscribing and re-renders on change.
  now = Date.now();
  listeners.add(listener);
  intervalId ??= setInterval(() => {
    now = Date.now();
    listeners.forEach((notify) => notify());
  }, TICK_MS);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && intervalId !== undefined) {
      clearInterval(intervalId);
      intervalId = undefined;
    }
  };
};

/**
 * Current time (epoch ms), or null on the server and during hydration.
 * The null phase keeps the first client render identical to the cached
 * HTML; time-based filtering kicks in on the render right after.
 */
export const useNow = (): number | null =>
  useSyncExternalStore(
    subscribe,
    () => now,
    () => null
  );
