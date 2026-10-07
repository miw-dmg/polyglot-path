import { Phone } from "lucide-react";

export function CallButton() {
  return (
    <a
      href="tel:+33628540270"
      aria-label="Appeler PolyLinguist"
      className="fixed bottom-20 right-4 z-50 md:bottom-5 md:right-5 inline-flex items-center gap-2 rounded-full bg-sage-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-sage-900 hover:shadow-xl hover:scale-105"
    >
      <Phone className="h-4 w-4" />
      Appeler
    </a>
  );
}
