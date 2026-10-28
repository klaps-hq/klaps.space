// Thin GA4 wrapper. Event names follow GA4 recommended events where one
// exists (search, share), the rest are custom and need a custom dimension
// in GA for each param that should be reportable.
type AnalyticsEventParams = Record<string, string | number | boolean>;

interface AnalyticsEvents {
  cinema_website_click: { cinema_slug: string };
  add_to_calendar: { method: "google" | "ics"; item_name: string };
  share: { method: "native" | "copy"; item_name: string };
  save_cinema: { cinema_slug: string; saved: boolean };
  trailer_open: { item_name: string };
  search: { search_term: string; search_type: string };
  filter_change: { filter_type: "date" | "genre"; filter_value: string };
}

// No-ops when gtag is missing (GA not configured, blocked, or server render).
// Consent is handled by gtag Consent Mode, so callers never check it.
export const trackEvent = <K extends keyof AnalyticsEvents>(
  name: K,
  params: AnalyticsEvents[K]
): void => {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  window.gtag("event", name, params as AnalyticsEventParams);
};
