import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { CreditCard, Lock, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Stepper } from "@/routes/panier";
import { useCart, formatPrice, type CartItem } from "@/lib/cart";
import { formatSessionDate } from "@/lib/sessions";
import { supabase } from "@/integrations/supabase/client";
import { createGuestOrder } from "@/lib/orders.functions";

export const Route = createFileRoute("/checkout")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Paiement — Linguist" },
      { name: "description", content: "Réglez votre commande de sessions d'anglais en direct, sans créer de compte." },
      { property: "og:title", content: "Paiement — Linguist" },
      { property: "og:description", content: "Paiement rapide, sans inscription." },
    ],
  }),
  component: Checkout,
});

const billingSchema = z.object({
  name: z.string().trim().min(1, "Nom requis").max(100),
  email: z.string().trim().email("Email invalide").max(254),
});

function Checkout() {
  const cart = useCart();
  const [step, setStep] = useState<2 | 3>(2);
  const [billing, setBilling] = useState({ name: "", email: "" });
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "" });
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState<{ items: CartItem[]; totalCents: number; email: string } | null>(null);

  if (confirmed) {
    return (
      <div className="min-h-screen bg-cream-100 text-sage-900">
        <Header />
        <div className="mx-auto max-w-2xl px-6 py-20">
          <div className="rounded-2xl bg-white p-10 ring-1 ring-sage-100">
            <CheckCircle2 className="h-10 w-10 text-sage-600" />
            <h1 className="mt-4 font-serif text-3xl">Commande confirmée</h1>
            <p className="mt-2 text-muted-foreground">
              Un récapitulatif et les liens de visioconférence ont été associés à {confirmed.email}.
            </p>
            <ul className="mt-6 space-y-3">
              {confirmed.items.map((i) => (
                <li key={i.courseId} className="rounded-lg bg-sage-50 p-4">
                  <div className="font-semibold">{i.title}</div>
                  {i.sessionStartsAt && (
                    <div className="text-sm text-muted-foreground">{formatSessionDate(i.sessionStartsAt)}</div>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex justify-between border-t border-sage-100 pt-4">
              <span className="font-semibold">Total réglé</span>
              <span className="font-serif text-2xl font-bold text-sage-600">{formatPrice(confirmed.totalCents)}</span>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/catalogue" className="rounded-lg bg-sage-600 px-6 py-3 font-semibold text-white hover:bg-sage-900">
                Voir d'autres cours
              </Link>
              <Link to="/auth" search={{ mode: "signup", redirect: "/compte" }} className="rounded-lg border border-sage-100 px-6 py-3 font-semibold hover:bg-sage-50">
                Créer un compte pour suivre mes sessions
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (cart.items.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-cream-100">
        <Header />
        <div className="mx-auto max-w-2xl px-6 py-24 text-center">
          <h1 className="font-serif text-3xl mb-4">Votre panier est vide</h1>
          <Link to="/catalogue" className="inline-block rounded-lg bg-sage-600 px-6 py-3 font-semibold text-white">Voir les cours</Link>
        </div>
      </div>
    );
  }

  async function pay(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const items = cart.items;
    const total = cart.totalCents;
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data: order, error } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          total_cents: total,
          status: "completed",
          billing_name: billing.name,
          billing_email: billing.email,
        })
        .select()
        .single();
      if (error || !order) { setLoading(false); return toast.error("Erreur de commande"); }

      await supabase.from("order_items").insert(
        items.map((i) => ({
          order_id: order.id,
          course_id: i.courseId,
          course_title: i.title,
          price_cents: i.priceCents,
          quantity: 1,
        })),
      );

      await supabase
        .from("enrollments")
        .upsert(items.map((i) => ({ user_id: user.id, course_id: i.courseId, progress: 0 })), { onConflict: "user_id,course_id" });

      const bookings = items
        .filter((i) => !!i.sessionId)
        .map((i) => ({ session_id: i.sessionId as string, user_id: user.id, order_id: order.id }));
      if (bookings.length > 0) {
        const { error: bookingError } = await supabase.from("session_bookings").insert(bookings);
        if (bookingError) toast.error("Créneau non réservé : " + bookingError.message);
      }
    } else {
      try {
        const result = await placeGuestOrder({
          data: {
            name: billing.name,
            email: billing.email,
            items: items.map((i) => ({ courseId: i.courseId, sessionId: i.sessionId ?? null })),
          },
        });
        if (result.warning) toast.warning(result.warning);
      } catch (err) {
        setLoading(false);
        return toast.error(err instanceof Error ? err.message : "Erreur de commande");
      }
    }

    cart.clear();
    setLoading(false);
    setConfirmed({ items, totalCents: total, email: billing.email });
    toast.success("Paiement validé. Bon apprentissage.");
  }

  function goToPayment(e: React.FormEvent) {
    e.preventDefault();
    const parsed = billingSchema.safeParse(billing);
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    setStep(3);
  }

  return (
    <div className="min-h-screen bg-cream-100 text-sage-900">
      <Header />

      <div className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="font-serif text-4xl mb-2">{step === 2 ? "Vos informations" : "Paiement"}</h1>
        <p className="text-muted-foreground mb-8">Étape {step} sur 3 · aucun compte nécessaire</p>
        <Stepper step={step} />

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
          {step === 2 ? (
            <form onSubmit={goToPayment} className="space-y-5 rounded-2xl bg-white p-8 ring-1 ring-sage-100">
              <h2 className="font-serif text-xl">Vos coordonnées</h2>
              <div>
                <label className="text-sm font-medium block mb-1.5">Nom complet</label>
                <input value={billing.name} onChange={(e) => setBilling({ ...billing, name: e.target.value })} required className="w-full rounded-lg border border-sage-100 px-4 py-2.5 focus:border-sage-600 focus:outline-none" />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1.5">Email</label>
                <input type="email" required value={billing.email} onChange={(e) => setBilling({ ...billing, email: e.target.value })} className="w-full rounded-lg border border-sage-100 px-4 py-2.5 focus:border-sage-600 focus:outline-none" />
                <p className="mt-1.5 text-xs text-muted-foreground">Nous y envoyons votre facture et vos liens de visioconférence.</p>
              </div>
              <button className="w-full sm:w-auto rounded-lg bg-sage-600 px-6 py-3 font-semibold text-white hover:bg-sage-900 transition-colors">
                Passer au paiement
              </button>
            </form>
          ) : (
            <form onSubmit={pay} className="space-y-5 rounded-2xl bg-white p-8 ring-1 ring-sage-100">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Lock className="h-3.5 w-3.5" /> Paiement sécurisé · démonstration (aucun débit réel)
              </div>
              <h2 className="font-serif text-xl flex items-center gap-2"><CreditCard className="h-5 w-5" /> Carte bancaire</h2>
              <div>
                <label className="text-sm font-medium block mb-1.5">Numéro de carte</label>
                <input value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })} placeholder="4242 4242 4242 4242" className="w-full rounded-lg border border-sage-100 px-4 py-2.5 focus:border-sage-600 focus:outline-none" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-1.5">Expiration</label>
                  <input value={card.expiry} onChange={(e) => setCard({ ...card, expiry: e.target.value })} placeholder="MM/AA" className="w-full rounded-lg border border-sage-100 px-4 py-2.5 focus:border-sage-600 focus:outline-none" required />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1.5">CVC</label>
                  <input value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value })} placeholder="123" className="w-full rounded-lg border border-sage-100 px-4 py-2.5 focus:border-sage-600 focus:outline-none" required />
                </div>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(2)} className="rounded-lg border border-sage-100 px-5 py-3 font-semibold hover:bg-sage-50">Retour</button>
                <button disabled={loading} className="flex-1 rounded-lg bg-sage-600 px-6 py-3 font-semibold text-white hover:bg-sage-900 transition-colors disabled:opacity-60">
                  {loading ? "Traitement..." : `Payer ${formatPrice(cart.totalCents)}`}
                </button>
              </div>
            </form>
          )}

          <aside className="lg:sticky lg:top-24 self-start rounded-2xl bg-white p-6 ring-1 ring-sage-100">
            <h2 className="font-serif text-xl mb-4">Récapitulatif</h2>
            <div className="space-y-3 mb-4 pb-4 border-b border-sage-100">
              {cart.items.map((i) => (
                <div key={i.courseId} className="text-sm">
                  <div className="flex justify-between">
                    <span className="line-clamp-1 pr-2">{i.title}</span>
                    <span className="font-medium shrink-0">{formatPrice(i.priceCents)}</span>
                  </div>
                  {i.sessionStartsAt && (
                    <div className="text-xs text-muted-foreground">{formatSessionDate(i.sessionStartsAt)}</div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Total</span>
              <span className="font-serif text-2xl font-bold text-sage-600">{formatPrice(cart.totalCents)}</span>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
