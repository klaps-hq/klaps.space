"use client";

import React, { useEffect, useSyncExternalStore } from "react";
import Link from "next/link";

const CONSENT_STORAGE_KEY = "klaps-analytics-consent";
const CONSENT_CHANGE_EVENT = "klaps-consent-change";

type ConsentValue = "granted" | "denied";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const updateGtagConsent = (value: ConsentValue) => {
  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", { analytics_storage: value });
    return;
  }
  // gtag may not be defined yet - queue the update on the dataLayer.
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(["consent", "update", { analytics_storage: value }]);
};

const subscribe = (callback: () => void) => {
  window.addEventListener(CONSENT_CHANGE_EVENT, callback);
  return () => window.removeEventListener(CONSENT_CHANGE_EVENT, callback);
};

const getSnapshot = () => window.localStorage.getItem(CONSENT_STORAGE_KEY);

// On the server we don't know the choice yet - render nothing.
const getServerSnapshot = () => "pending";

const ConsentBanner: React.FC = () => {
  const consent = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  // Re-apply the stored choice to gtag on every page load.
  useEffect(() => {
    if (consent === "granted" || consent === "denied") {
      updateGtagConsent(consent);
    }
  }, [consent]);

  const handleChoice = (value: ConsentValue) => {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, value);
    window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
  };

  // Banner shows only when no choice has been made yet.
  if (consent !== null) return null;

  return (
    <aside
      role="region"
      aria-label="Zgoda na pliki cookie"
      className="fixed bottom-0 left-0 right-0 z-[80] border-t border-white/15 bg-black/95 backdrop-blur-md"
    >
      {/* Compact on mobile: the banner overlays the bottom of the
          100vh hero, where the primary CTA sits on small screens. */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 px-6 md:px-12 lg:px-16 py-4 sm:py-5">
        <p className="text-xs md:text-sm text-white/65 leading-relaxed max-w-[70ch] text-pretty">
          Używamy anonimowych statystyk (Google&nbsp;Analytics), żeby
          rozumieć, jak&nbsp;działa serwis.
          <br className="hidden sm:block" />{" "}
          Dane zbieramy tylko za&nbsp;Twoją&nbsp;zgodą.{" "}
          {/* py/-my widen the tap target without moving anything visually. */}
          <Link
            href="/polityka-prywatnosci"
            className="inline-block py-2 -my-2 whitespace-nowrap text-white/85 underline underline-offset-4 decoration-white/30 hover:decoration-white transition-colors"
          >
            Polityka prywatności
          </Link>
        </p>
        <div className="flex items-center gap-3 shrink-0">
          {/* min-h-11 = 44px minimum tap target (WCAG); the first
              interaction on every visit should not need precise aim. */}
          <button
            type="button"
            onClick={() => handleChoice("denied")}
            className="inline-flex items-center justify-center min-h-11 px-5 py-2.5 text-[11px] uppercase tracking-[0.2em] text-white/55 hover:text-white transition-colors"
          >
            Odrzucam
          </button>
          <button
            type="button"
            onClick={() => handleChoice("granted")}
            className="inline-flex items-center justify-center min-h-11 px-6 py-2.5 text-[11px] uppercase tracking-[0.2em] text-black bg-white hover:bg-white/85 transition-colors"
          >
            Akceptuję
          </button>
        </div>
      </div>
    </aside>
  );
};

export default ConsentBanner;
