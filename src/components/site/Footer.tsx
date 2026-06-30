import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const emailSchema = z.string().trim().email("Email invalide").max(254);

export function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    setLoading(true);
    const { error } = await supabase.from("newsletter_subscribers").insert({ email: parsed.data });
    setLoading(false);
    if (error) {
      if (error.code === "23505") toast.success("Vous êtes déjà inscrit·e ✓");
      else toast.error("Une erreur est survenue");
      return;
    }
    toast.success("Merci ! Vérifiez votre boîte mail.");
    setEmail("");
  }

  return (
    <footer className="border-t border-sage-100 py-20 bg-cream-100">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <span className="mb-4 block font-serif text-2xl font-bold text-sage-600">Linguist.</span>
            <p className="mb-6 max-w-sm text-muted-foreground">
              Recevez chaque semaine nos conseils d'apprentissage et nos nouvelles offres de cours directement dans votre boîte mail.
            </p>
            <form onSubmit={subscribe} className="flex max-w-md gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="flex-1 rounded-lg border border-sage-100 bg-white px-4 py-2.5 text-sm focus:border-sage-600 focus:outline-none"
                required
              />
              <button disabled={loading} type="submit" className="rounded-lg bg-sage-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-sage-900 transition-colors disabled:opacity-60">
                {loading ? "..." : "S'abonner"}
              </button>
            </form>
          </div>
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest">Navigation</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link to="/catalogue" className="hover:text-sage-600">Tous les cours</Link></li>
              <li><Link to="/a-propos" className="hover:text-sage-600">À propos</Link></li>
              <li><Link to="/contact" className="hover:text-sage-600">Contact</Link></li>
              <li><Link to="/auth" className="hover:text-sage-600">Mon compte</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest">Légal</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-sage-600">Confidentialité</a></li>
              <li><a href="#" className="hover:text-sage-600">Mentions légales</a></li>
              <li><a href="#" className="hover:text-sage-600">CGV</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-20 border-t border-sage-50 pt-8 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Linguist Academy. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
