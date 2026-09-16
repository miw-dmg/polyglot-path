import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Trash2, ShoppingBag, CalendarDays } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { useCart, formatPrice, type CartItem } from "@/lib/cart";
import { resolveImage } from "@/lib/courses";
import { courseSessionsQuery, formatSessionDate } from "@/lib/sessions";

export const Route = createFileRoute("/panier")({
  head: () => ({
    meta: [
      { title: "Panier — Linguist" },
      { name: "description", content: "Votre sélection de cours de langues." },
    ],
  }),
  component: Cart,
});

function SlotPicker({ item }: { item: CartItem }) {
  const cart = useCart();
  const { data: sessions, isLoading } = useQuery(courseSessionsQuery(item.courseId));

  return (
    <div className="mt-4 border-t border-sage-100 pt-4">
      <div className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
        <CalendarDays className="h-3.5 w-3.5" /> Choisissez votre créneau
      </div>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Chargement des créneaux…</p>
      ) : !sessions || sessions.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucun créneau disponible pour le moment.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {sessions.map((s) => {
            const selected = item.sessionId === s.id;
            const full = s.spots_left <= 0;
            return (
              <button
                key={s.id}
                type="button"
                disabled={full}
                onClick={() => cart.setSession(item.courseId, selected ? null : s.id, selected ? null : s.starts_at)}
                className={`rounded-lg px-3 py-2 text-left text-xs transition-colors ${
                  selected
                    ? "bg-sage-600 text-white"
                    : full
                      ? "cursor-not-allowed bg-sage-50 text-muted-foreground opacity-60"
                      : "bg-sage-50 hover:bg-sage-100"
                }`}
              >
                <span className="block font-semibold">{formatSessionDate(s.starts_at)}</span>
                <span className="block opacity-80">
                  {s.duration_minutes} min · {full ? "Complet" : `${s.spots_left} place${s.spots_left > 1 ? "s" : ""}`}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Cart() {
  const cart = useCart();
  const allSlotsChosen = cart.items.length > 0 && cart.items.every((i) => !!i.sessionId);

  return (
    <div className="min-h-screen bg-cream-100 text-sage-900">
      <Header />

      <div className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="font-serif text-4xl md:text-5xl mb-2">Votre panier</h1>
        <p className="text-muted-foreground mb-10">
          Étape 1 sur 3 — Vérifiez votre sélection et réservez vos créneaux.
        </p>

        <Stepper step={1} />

        {cart.items.length === 0 ? (
          <div className="mt-12 rounded-2xl bg-white p-12 text-center ring-1 ring-sage-100">
            <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="font-serif text-2xl mb-2">Votre panier est vide</h2>
            <p className="text-muted-foreground mb-6">Explorez notre catalogue pour commencer.</p>
            <Link to="/catalogue" className="inline-block rounded-lg bg-sage-600 px-6 py-3 font-semibold text-white hover:bg-sage-900 transition-colors">
              Découvrir les cours
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              {cart.items.map((item) => {
                const img = resolveImage(item.imageUrl, item.language);
                return (
                  <div key={item.courseId} className="rounded-2xl bg-white p-4 ring-1 ring-sage-100">
                    <div className="flex gap-4">
                      <div className="size-24 shrink-0 overflow-hidden rounded-lg bg-sage-50 grid place-items-center">
                        {img ? <img src={img} alt="" className="h-full w-full object-cover" /> : <span className="text-3xl">🌍</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{item.language} · {item.format}</div>
                        <Link to="/cours/$slug" params={{ slug: item.slug }} className="font-semibold hover:text-sage-600 line-clamp-1">{item.title}</Link>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="font-serif text-lg font-bold text-sage-600">{formatPrice(item.priceCents)}</span>
                          <button onClick={() => cart.remove(item.courseId)} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive">
                            <Trash2 className="h-3.5 w-3.5" /> Retirer
                          </button>
                        </div>
                      </div>
                    </div>
                    <SlotPicker item={item} />
                  </div>
                );
              })}
            </div>

            <aside className="lg:sticky lg:top-24 self-start rounded-2xl bg-white p-6 shadow-soft ring-1 ring-sage-100">
              <h2 className="font-serif text-xl mb-4">Récapitulatif</h2>
              <div className="space-y-2 text-sm mb-4 pb-4 border-b border-sage-100">
                <div className="flex justify-between"><span className="text-muted-foreground">Sous-total</span><span>{formatPrice(cart.totalCents)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">TVA incluse</span><span>—</span></div>
              </div>
              <div className="flex justify-between mb-6">
                <span className="font-semibold">Total</span>
                <span className="font-serif text-2xl font-bold text-sage-600">{formatPrice(cart.totalCents)}</span>
              </div>
              {allSlotsChosen ? (
                <Link to="/checkout" className="block w-full text-center rounded-lg bg-sage-600 px-6 py-3.5 font-semibold text-white hover:bg-sage-900 transition-colors">
                  Passer au paiement
                </Link>
              ) : (
                <div>
                  <button disabled className="w-full cursor-not-allowed rounded-lg bg-sage-600/50 px-6 py-3.5 font-semibold text-white">
                    Passer au paiement
                  </button>
                  <p className="mt-2 text-center text-xs text-muted-foreground">Sélectionnez un créneau pour chaque cours.</p>
                </div>
              )}
              <p className="mt-3 text-center text-xs text-muted-foreground">Aucune inscription requise.</p>
              <Link to="/catalogue" className="mt-3 block text-center text-sm text-muted-foreground hover:text-sage-600">
                Continuer mes achats
              </Link>
            </aside>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export function Stepper({ step }: { step: 1 | 2 | 3 }) {
  const steps = ["Panier & créneaux", "Informations", "Paiement"];
  return (
    <ol className="flex flex-wrap items-center gap-3 text-xs font-semibold">
      {steps.map((s, i) => {
        const n = i + 1;
        const active = step === n;
        const done = step > n;
        return (
          <li key={s} className="flex items-center gap-3">
            <span className={`grid h-7 w-7 place-items-center rounded-full ${active ? "bg-sage-600 text-white" : done ? "bg-sage-100 text-sage-600" : "bg-white ring-1 ring-sage-100 text-muted-foreground"}`}>
              {n}
            </span>
            <span className={active ? "text-sage-900" : "text-muted-foreground"}>{s}</span>
            {i < steps.length - 1 && <span className="h-px w-8 bg-sage-100" />}
          </li>
        );
      })}
    </ol>
  );
}
