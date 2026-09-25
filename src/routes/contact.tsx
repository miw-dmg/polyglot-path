import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Mail, MapPin, MessageSquare } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Linguist" },
      { name: "description", content: "Une question ? Notre équipe vous répond sous 24h ouvrées." },
      { property: "og:title", content: "Contact — Linguist" },
      { property: "og:description", content: "Une question ? Contactez notre équipe." },
    ],
  }),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(1, "Nom requis").max(100),
  email: z.string().trim().email("Email invalide").max(254),
  message: z.string().trim().min(10, "Message trop court").max(2000),
});

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    setLoading(true);
    // For now: simulate a submission.
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    toast.success("Message envoyé. Nous vous répondons sous 24h.");
    setForm({ name: "", email: "", message: "" });
  }

  return (
    <div className="min-h-screen bg-cream-100 text-sage-900">
      <Header />

      <div className="mx-auto max-w-5xl px-6 py-20">
        <h1 className="font-serif text-5xl mb-3">Contact</h1>
        <p className="text-muted-foreground mb-12">Une question, une suggestion ? Écrivez-nous.</p>

        <div className="grid gap-12 lg:grid-cols-[1fr_300px]">
          <form onSubmit={submit} className="space-y-5 rounded-2xl bg-white p-8 ring-1 ring-sage-100">
            <div>
              <label className="text-sm font-medium block mb-2">Nom</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border border-sage-100 bg-white px-4 py-2.5 focus:border-sage-600 focus:outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-lg border border-sage-100 bg-white px-4 py-2.5 focus:border-sage-600 focus:outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Message</label>
              <textarea rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full rounded-lg border border-sage-100 bg-white px-4 py-2.5 focus:border-sage-600 focus:outline-none resize-none" />
            </div>
            <button disabled={loading} className="w-full sm:w-auto rounded-lg bg-sage-600 px-6 py-3 font-semibold text-white hover:bg-sage-900 transition-colors disabled:opacity-60">
              {loading ? "Envoi..." : "Envoyer le message"}
            </button>
          </form>

          <aside className="space-y-6">
            <Info icon={Mail} label="Email" value="contact@polylinguist.fr" />
            <Info icon={MessageSquare} label="Support" value="Lun-Ven · 9h-18h" />
            <Info icon={MapPin} label="Adresse" value="12 rue des Langues, 75011 Paris" />
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function Info({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white p-5 ring-1 ring-sage-100">
      <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-sage-100 text-sage-600">
        <Icon className="h-4 w-4" />
      </div>
      <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="font-medium mt-1">{value}</div>
    </div>
  );
}
