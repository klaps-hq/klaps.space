import {
  PREFERRED_CITY_KEY,
  PREFERRED_VOIVODESHIP_KEY,
} from "./city-storage";
import { VOIVODESHIPS } from "./voivodeships";

/**
 * Listing pages are cached with their default (nationwide, unfiltered) grid
 * baked into the HTML, while a stored location or URL filter is applied only
 * after hydration. Without a guard the visitor first sees the default grid
 * and then watches it swap to their region.
 *
 * FILTER_PENDING_SCRIPT runs in <head> before the body is painted and marks
 * <html> with FILTER_PENDING_ATTR when such a swap is coming:
 * - "query": the URL carries filter params (every listing reacts to these),
 * - "location": only a stored city/voivodeship (only sections that follow
 *   the stored location react to it).
 * globals.css keeps the matching [data-filter-default] grids invisible (but
 * laid out, so nothing shifts) and shows their loader until a filter island
 * calls clearFilterPending().
 */
export const FILTER_PENDING_ATTR = "data-filter-pending";

/** Home grid fetch started by the boot script, reused by the controller. */
export interface HomeScreeningsPrefetch {
  query: string;
  promise: Promise<unknown>;
}

declare global {
  interface Window {
    __klapsHomePrefetch?: HomeScreeningsPrefetch;
  }
}

// Mirrors FILTER_PARAM_KEYS in proxy.ts and the query built by the home
// ScreeningsFilterController (same keys, same order), so a prefetched
// response is only reused for the exact query the controller asks for.
const QUERY_KEYS = ["genres", "dateFrom", "dateTo", "search"];

// Plain ES5 on purpose: it ships inline, unbundled and untranspiled. The
// timeout is a safety net so a failed hydration never leaves the grid
// hidden for good.
export const FILTER_PENDING_SCRIPT = `(function(){try{
var q=new URLSearchParams(location.search),keys=${JSON.stringify(QUERY_KEYS)};
var city=q.get("city")||"",voiv=city?"":(q.get("voivodeship")||"");
var hasQuery=Boolean(city||voiv)||keys.some(function(k){return q.get(k);});
if(!city&&!voiv){city=localStorage.getItem(${JSON.stringify(PREFERRED_CITY_KEY)})||"";voiv=city?"":(localStorage.getItem(${JSON.stringify(PREFERRED_VOIVODESHIP_KEY)})||"");if(${JSON.stringify(VOIVODESHIPS)}.indexOf(voiv)<0)voiv="";}
if(!hasQuery&&!city&&!voiv)return;
var root=document.documentElement;
root.setAttribute(${JSON.stringify(FILTER_PENDING_ATTR)},hasQuery?"query":"location");
setTimeout(function(){root.removeAttribute(${JSON.stringify(FILTER_PENDING_ATTR)});},8000);
if(location.pathname!=="/")return;
var p=new URLSearchParams();
if(city)p.set("city",city);else if(voiv)p.set("voivodeship",voiv);
keys.forEach(function(k){var v=q.get(k);if(v)p.set(k,v);});
var query=p.toString();
window.__klapsHomePrefetch={query:query,promise:fetch("/api/screenings?"+query).then(function(r){if(!r.ok)throw new Error("HTTP "+r.status);return r.json();})};
window.__klapsHomePrefetch.promise.catch(function(){});
}catch(e){}})();`;

/** Lets the cached default grid show again; called once filters resolve. */
export const clearFilterPending = (): void => {
  document.documentElement.removeAttribute(FILTER_PENDING_ATTR);
};

/**
 * Hands over the boot script's home fetch when it was made for `query`.
 * Single use: a later visit to the same query fetches fresh data.
 */
export const takeHomePrefetch = (query: string): Promise<unknown> | null => {
  const prefetch = window.__klapsHomePrefetch;
  if (!prefetch || prefetch.query !== query) return null;
  window.__klapsHomePrefetch = undefined;
  return prefetch.promise;
};
