import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { getRegion, needsConsent, readConsent, saveConsent } from "@/lib/consent";

export function CookieBanner() {
  const [open, setOpen] = useState(false);
  const [region, setRegion] = useState("XX");

  useEffect(() => {
    getRegion().then((r) => {
      setRegion(r);
      if (!readConsent() && needsConsent(r)) setOpen(true);
    });
    const show = () => setOpen(true);
    window.addEventListener("pl-open-cookie-settings", show);
    return () => window.removeEventListener("pl-open-cookie-settings", show);
  }, []);

  if (!open) return null;
  const choose = (ads: boolean) => { saveConsent(ads, region); setOpen(false); };

  return (
    <div role="dialog" aria-label="Cookies" className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-xl rounded-2xl bg-white p-5 shadow-soft ring-1 ring-sage-100 text-sage-900">
      <p className="text-sm">
        Avec votre accord, nous utilisons le pixel Meta (Facebook, Instagram) pour mesurer l'efficacité de nos publicités. Vous pouvez changer d'avis à tout moment via « Cookies » en bas de page.{" "}
        <Link to="/confidentialite" className="font-semibold underline">En savoir plus</Link>
      </p>
      <div className="mt-4 flex gap-3">
        <button onClick={() => choose(false)} className="flex-1 rounded-lg border border-sage-600 px-4 py-2.5 text-sm font-semibold text-sage-600 hover:bg-sage-50">Refuser</button>
        <button onClick={() => choose(true)} className="flex-1 rounded-lg bg-sage-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sage-900">Accepter</button>
      </div>
    </div>
  );
}
