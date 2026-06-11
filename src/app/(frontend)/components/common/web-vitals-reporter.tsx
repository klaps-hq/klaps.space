"use client";

import { useReportWebVitals } from "next/web-vitals";

// Reports Core Web Vitals (LCP, INP, CLS, FCP, TTFB) to GA4 as events so we
// get real field data without depending on CrUX sampling (which needs traffic
// the site does not yet have). Mounted only when GA is configured; it also
// no-ops until gtag exists, so it never sends before analytics consent.
const WebVitalsReporter = () => {
  useReportWebVitals((metric) => {
    if (typeof window === "undefined") return;
    const gtag = (
      window as unknown as { gtag?: (...args: unknown[]) => void }
    ).gtag;
    if (typeof gtag !== "function") return;

    gtag("event", metric.name, {
      // GA4 event value must be an integer. CLS is sub-1, so scale it up.
      value: Math.round(
        metric.name === "CLS" ? metric.value * 1000 : metric.value
      ),
      metric_id: metric.id,
      metric_value: metric.value,
      metric_rating: metric.rating,
      non_interaction: true,
    });
  });

  return null;
};

export default WebVitalsReporter;
