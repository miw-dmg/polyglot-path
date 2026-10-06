import { useEffect, useRef } from "react";
import { useRouterState } from "@tanstack/react-router";

const TAG_ID = "96384a622f7fe";

declare global {
  interface Window {
    _uxa?: unknown[];
  }
}

export function ContentsquareTag() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const loaded = useRef(false);

  useEffect(() => {
    window._uxa = window._uxa || [];

    if (!loaded.current) {
      loaded.current = true;
      window._uxa.push(["setPath", window.location.pathname + window.location.search]);

      const inject = () => {
        if (document.getElementById("contentsquare-tag")) return;
        const script = document.createElement("script");
        script.id = "contentsquare-tag";
        script.async = true;
        script.src = `https://t.contentsquare.net/uxa/${TAG_ID}.js`;
        document.head.appendChild(script);
      };
      // Defer the tracker so it doesn't compete with the first render on mobile.
      const start = () => {
        const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => void }).requestIdleCallback;
        if (ric) ric(inject, { timeout: 3000 });
        else setTimeout(inject, 1500);
      };
      if (document.readyState === "complete") start();
      else window.addEventListener("load", start, { once: true });
      return;
    }

    // Single-page navigation: report the new virtual page view.
    window._uxa.push(["trackPageview", window.location.pathname + window.location.search]);
  }, [pathname]);

  return null;
}
