/**
 * Runs `callback` once the page has loaded and the main thread is idle,
 * so non-essential work (smooth scroll, custom cursor, analytics) stays out
 * of hydration and the window Lighthouse counts as blocking time. Returns a
 * cancel function for effect cleanups.
 */
export const runWhenIdle = (
  callback: () => void,
  timeout = 2000
): (() => void) => {
  let idleId: number | undefined;
  let timerId: number | undefined;

  const schedule = () => {
    // Safari only ships requestIdleCallback from 18; a macrotask after the
    // load event is close enough there.
    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(callback, { timeout });
    } else {
      timerId = window.setTimeout(callback, 200);
    }
  };

  if (document.readyState === "complete") schedule();
  else window.addEventListener("load", schedule, { once: true });

  return () => {
    window.removeEventListener("load", schedule);
    if (idleId !== undefined) window.cancelIdleCallback(idleId);
    if (timerId !== undefined) window.clearTimeout(timerId);
  };
};

/** True on devices with a mouse or trackpad, where the desktop extras run. */
export const hasFinePointer = (): boolean =>
  window.matchMedia("(hover: hover) and (pointer: fine)").matches;
