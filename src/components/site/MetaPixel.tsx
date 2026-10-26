import { useEffect, useRef } from "react";
import { useRouterState } from "@tanstack/react-router";
import { adsAllowed, CONSENT_EVENT, CONSENT_KEY } from "@/lib/consent";

const PIXEL_ID = "1121259430309556";

type Fbq = ((...a: unknown[]) => void) & {
  callMethod?: (...a: unknown[]) => void;
  queue?: unknown[];
  push?: unknown;
  loaded?: boolean;
  version?: string;
};
declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

function loadPixel() {
  if (window.fbq) return;
  const n = function (...args: unknown[]) {
    if (n.callMethod) n.callMethod.apply(n, args);
    else n.queue!.push(args);
  } as Fbq;
  window.fbq = n;
  if (!window._fbq) window._fbq = n;
  n.push = n;
  n.loaded = true;
  n.version = "2.0";
  n.queue = [];
  const t = document.createElement("script");
  t.async = true;
  t.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(t);
  n("init", PIXEL_ID, {}, { agent: "lovable" });
}

export function MetaPixel() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const active = useRef(false);

  useEffect(() => {
    const sync = async () => {
      const ok = await adsAllowed();
      if (ok) {
        const first = !window.fbq;
        loadPixel();
        if (!first && !active.current) window.fbq!("consent", "grant");
        if (!active.current) window.fbq!("track", "PageView");
        active.current = true;
      } else if (active.current) {
        window.fbq?.("consent", "revoke");
        active.current = false;
      }
    };
    void sync();
    const onStorage = (e: StorageEvent) => e.key === CONSENT_KEY && void sync();
    window.addEventListener(CONSENT_EVENT, sync);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(CONSENT_EVENT, sync);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (active.current) window.fbq?.("track", "PageView");
  }, [pathname]);

  return null;
}
