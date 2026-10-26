// Advertising consent (Meta Pixel). Stored per visitor with the notice version shown.
export const CONSENT_KEY = "pl_consent_v1";
export const CONSENT_NOTICE_VERSION = "2026-10-26";
export const CONSENT_EVENT = "pl-consent-change";

export type ConsentRecord = { ads: boolean; at: string; version: string; region: string };

// EU/EEA + UK + Switzerland require prior consent.
const CONSENT_REGIONS = new Set(
  "AT BE BG HR CY CZ DK EE FI FR DE GR HU IE IT LV LT LU MT NL PL PT RO SK SI ES SE IS LI NO GB CH".split(" "),
);

export function readConsent(): ConsentRecord | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    return raw ? (JSON.parse(raw) as ConsentRecord) : null;
  } catch {
    return null;
  }
}

export function saveConsent(ads: boolean, region: string) {
  const rec: ConsentRecord = { ads, at: new Date().toISOString(), version: CONSENT_NOTICE_VERSION, region };
  localStorage.setItem(CONSENT_KEY, JSON.stringify(rec));
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

let regionPromise: Promise<string> | null = null;
/** Country code, or "XX" when unknown (treated as a consent region). */
export function getRegion(): Promise<string> {
  if (!regionPromise) {
    regionPromise = (async () => {
      try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 2000);
        const res = await fetch("/cdn-cgi/trace", { signal: ctrl.signal });
        clearTimeout(t);
        if (!res.ok) return "XX";
        const m = (await res.text()).match(/^loc=(\w+)$/m);
        return m ? m[1] : "XX";
      } catch {
        return "XX";
      }
    })();
  }
  return regionPromise;
}

export function needsConsent(region: string) {
  return region === "XX" || region === "T1" || CONSENT_REGIONS.has(region);
}

/** Read fresh at each send: may advertising tags run right now? */
export async function adsAllowed(): Promise<boolean> {
  const c = readConsent();
  if (c) return c.ads;
  return !needsConsent(await getRegion());
}

export function openCookieSettings() {
  window.dispatchEvent(new Event("pl-open-cookie-settings"));
}
