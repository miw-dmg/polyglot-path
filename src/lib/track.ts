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
    const eventID = `${event}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    if (event === "lead_form_submit") w.fbq?.("track", "Lead", params, { eventID });
    else if (event === "booking_complete") w.fbq?.("track", "Schedule", params, { eventID });
    else w.fbq?.("trackCustom", event, params, { eventID });
    w._uxa = w._uxa || [];
    w._uxa.push(["trackPageEvent", event]);
  } catch {
    /* tracking must never break the page */
  }
}
