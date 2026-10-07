// Lightweight conversion-event helper: forwards to Meta Pixel / gtag / Contentsquare when present.
type W = Window & {
  fbq?: (...a: unknown[]) => void;
  gtag?: (...a: unknown[]) => void;
  _uxa?: unknown[];
};

export function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const w = window as W;
  try {
    w.gtag?.("event", event, params);
    if (event === "lead_form_submit") w.fbq?.("track", "Lead", params);
    else if (event === "booking_complete") w.fbq?.("track", "Schedule", params);
    else w.fbq?.("trackCustom", event, params);
    w._uxa = w._uxa || [];
    w._uxa.push(["trackPageEvent", event]);
  } catch {
    /* tracking must never break the page */
  }
}
