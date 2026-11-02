"use client";

import { useEffect, useSyncExternalStore } from "react";
import { runWhenIdle } from "@/lib/idle";
import {
  CONSENT_CHANGE_EVENT,
  CONSENT_STORAGE_KEY,
} from "@/components/common/consent-banner";

interface AnalyticsLoaderProps {
  measurementId: string;
}

const GTAG_SCRIPT_ID = "gtag-js";

const subscribe = (callback: () => void) => {
  window.addEventListener(CONSENT_CHANGE_EVENT, callback);
  return () => window.removeEventListener(CONSENT_CHANGE_EVENT, callback);
};

const getSnapshot = () => window.localStorage.getItem(CONSENT_STORAGE_KEY);

const getServerSnapshot = () => null;

// The stub is cheap and set up right away, so early events (web vitals,
// clicks) queue on the dataLayer until gtag.js arrives on idle.
const defineGtagStub = (measurementId: string) => {
  if (typeof window.gtag === "function") return;

  window.dataLayer = window.dataLayer || [];
  // gtag.js only processes Arguments objects, hence no rest parameters.
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  // Only ever runs after the visitor accepted, so analytics starts granted;
  // the ad signals stay off.
  window.gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "granted",
  });
  window.gtag("js", new Date());
  window.gtag("config", measurementId);
};

const injectGtagScript = (measurementId: string) => {
  if (document.getElementById(GTAG_SCRIPT_ID)) return;
  const script = document.createElement("script");
  script.id = GTAG_SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);
};

/**
 * Sets up Google Analytics only once analytics consent is granted, with
 * gtag.js itself fetched on idle. Until consent, window.gtag is undefined,
 * so trackEvent and the web vitals reporter no-op instead of queueing
 * events nobody agreed to send.
 */
const AnalyticsLoader: React.FC<AnalyticsLoaderProps> = ({ measurementId }) => {
  const consent = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  useEffect(() => {
    if (consent !== "granted") return;
    defineGtagStub(measurementId);
    return runWhenIdle(() => injectGtagScript(measurementId));
  }, [consent, measurementId]);

  return null;
};

export default AnalyticsLoader;
