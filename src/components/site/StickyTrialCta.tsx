import { Link, useRouterState } from "@tanstack/react-router";
import { Gift } from "lucide-react";
import { track } from "@/lib/track";

export function StickyTrialCta() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  if (path.startsWith("/essai-gratuit") || path.startsWith("/panier") || path.startsWith("/checkout")) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-sage-100 bg-cream-100/95 p-3 backdrop-blur md:hidden">
      <Link
        to="/essai-gratuit"
        onClick={() => track("cta_click", { location: "sticky_mobile" })}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-sage-600 py-3 text-sm font-semibold text-white"
      >
        <Gift className="h-4 w-4" /> Séance gratuite
      </Link>
    </div>
  );
}
