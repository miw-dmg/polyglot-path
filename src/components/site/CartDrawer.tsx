import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { X, ShoppingBag, Loader2, CalendarDays } from "lucide-react";
import { toast } from "sonner";
import { useCart, formatPrice, type CartItem } from "@/lib/cart";
import { resolveImage } from "@/lib/courses";
import { formatSessionDate } from "@/lib/sessions";
import { createShopifyCheckout } from "@/lib/shopify";

export const CART_OPEN_EVENT = "cart:open";

export function openCart() {
  window.dispatchEvent(new CustomEvent(CART_OPEN_EVENT));
}

export function CartDrawer() {
  const cart = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener(CART_OPEN_EVENT, handler);
    return () => window.removeEventListener(CART_OPEN_EVENT, handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  const allSlotsChosen = cart.items.length > 0 && cart.items.every((i) => !!i.sessionId);

  async function goToShopify() {
    setPaying(true);
    try {
      const url = await createShopifyCheckout(
        cart.items.map((i) => ({
          slug: i.slug,
          title: i.title,
          sessionLabel: i.sessionStartsAt ? formatSessionDate(i.sessionStartsAt) : null,
          sessionId: i.sessionId ?? null,
        })),
      );
      if (url) window.open(url, "_blank");
      else toast.error("Paiement indisponible pour le moment.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur de paiement");
    } finally {
      setPaying(false);
    }
  }

  return (
    <div className={`fixed inset-0 z-[100] ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      {/* Backdrop */}
      <div
        onClick={close}
        className={`absolute inset-0 bg-sage-900/40 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
      />
      {/* Panel sliding from the right */}
      <aside
        role="dialog"
        aria-label="Panier"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-cream-100 shadow-soft transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-sage-100 px-6 py-4">
          <h2 className="inline-flex items-center gap-2 font-serif text-xl">
            <ShoppingBag className="h-5 w-5" /> Votre panier
          </h2>
          <button
            onClick={close}
            className="grid h-9 w-9 place-items-center rounded-full hover:bg-sage-50 transition-colors"
            aria-label="Fermer le panier"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {cart.items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            <p className="text-muted-foreground">Votre panier est vide.</p>
            <Link
              to="/catalogue"
              onClick={close}
              className="rounded-lg bg-sage-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sage-900 transition-colors"
            >
              Découvrir les cours
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
              {cart.items.map((item) => (
                <CartLine key={item.courseId} item={item} onRemove={() => cart.remove(item.courseId)} />
              ))}
            </div>
            <div className="border-t border-sage-100 bg-white px-6 py-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-serif text-2xl font-bold text-sage-600">{formatPrice(cart.totalCents)}</span>
              </div>
              {allSlotsChosen ? (
                <button
                  onClick={goToShopify}
                  disabled={paying}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-sage-600 px-6 py-3.5 font-semibold text-white hover:bg-sage-900 transition-colors disabled:opacity-60"
                >
                  {paying ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Continuer vers le paiement sécurisé
                </button>
              ) : (
                <button
                  onClick={() => {
                    close();
                    navigate({ to: "/panier" });
                  }}
                  className="w-full rounded-lg bg-sage-600 px-6 py-3.5 font-semibold text-white hover:bg-sage-900 transition-colors"
                >
                  Voir le panier et choisir un créneau
                </button>
              )}
              <button
                onClick={() => {
                  close();
                  navigate({ to: "/panier" });
                }}
                className="mt-3 block w-full text-center text-sm text-muted-foreground hover:text-sage-600"
              >
                Voir le panier
              </button>
              <p className="mt-3 text-center text-xs text-muted-foreground">Paiement sécurisé par Shopify · Satisfait ou remboursé.</p>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

function CartLine({ item, onRemove }: { item: CartItem; onRemove: () => void }) {
  const img = resolveImage(item.imageUrl, item.language);
  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-sage-100">
      <div className="flex gap-3">
        <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-sage-50 grid place-items-center">
          {img ? <img src={img} alt="" className="h-full w-full object-cover" /> : <ShoppingBag className="h-5 w-5 text-muted-foreground" />}
        </div>
        <div className="flex-1 min-w-0">
          <Link to="/cours/$slug" params={{ slug: item.slug }} className="block font-semibold line-clamp-1 hover:text-sage-600">
            {item.title}
          </Link>
          <span className="font-serif text-base font-bold text-sage-600">{formatPrice(item.priceCents)}</span>
        </div>
        <button onClick={onRemove} className="self-start text-xs text-muted-foreground hover:text-destructive" aria-label="Retirer du panier">
          <X className="h-4 w-4" />
        </button>
      </div>
      {item.sessionStartsAt ? (
        <p className="mt-3 rounded-lg bg-sage-50 px-3 py-2 text-xs font-semibold text-sage-600">
          {formatSessionDate(item.sessionStartsAt)} · heure de Paris · 1 place réservée
        </p>
      ) : (
        <p className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-sage-50 px-3 py-2 text-xs text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5" /> Créneau à choisir dans le panier
        </p>
      )}
    </div>
  );
}
