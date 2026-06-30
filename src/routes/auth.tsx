import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { supabase } from "@/integrations/supabase/client";

const searchSchema = z.object({
  mode: fallback(z.enum(["login", "signup"]), "login").default("login"),
  redirect: fallback(z.string().optional(), undefined),
});

export const Route = createFileRoute("/auth")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [{ title: "Connexion — Linguist" }, { name: "description", content: "Connectez-vous ou créez votre compte Linguist." }],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { mode, redirect } = Route.useSearch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: redirect ?? "/compte" });
    });
  }, [navigate, redirect]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const emailV = z.string().email().safeParse(email);
    if (!emailV.success) return toast.error("Email invalide");
    if (password.length < 6) return toast.error("Mot de passe trop court (6 min)");

    setLoading(true);
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: { full_name: name || email },
        },
      });
      setLoading(false);
      if (error) return toast.error(error.message);
      toast.success("Compte créé. Vous êtes connecté·e.");
      navigate({ to: redirect ?? "/compte" });
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) return toast.error(error.message === "Invalid login credentials" ? "Identifiants incorrects" : error.message);
      toast.success("Bon retour !");
      navigate({ to: redirect ?? "/compte" });
    }
  }

  return (
    <div className="min-h-screen bg-cream-100 text-sage-900">
      <Header />
      <div className="mx-auto max-w-md px-6 py-20">
        <div className="rounded-2xl bg-white p-8 shadow-soft ring-1 ring-sage-100">
          <h1 className="font-serif text-3xl mb-2">{mode === "signup" ? "Créer un compte" : "Connexion"}</h1>
          <p className="text-sm text-muted-foreground mb-6">
            {mode === "signup" ? "Rejoignez Linguist en quelques secondes." : "Accédez à votre espace personnel."}
          </p>

          <form onSubmit={submit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="text-sm font-medium block mb-1.5">Prénom</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-sage-100 px-4 py-2.5 focus:border-sage-600 focus:outline-none" />
              </div>
            )}
            <div>
              <label className="text-sm font-medium block mb-1.5">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-sage-100 px-4 py-2.5 focus:border-sage-600 focus:outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">Mot de passe</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg border border-sage-100 px-4 py-2.5 focus:border-sage-600 focus:outline-none" />
            </div>
            <button disabled={loading} className="w-full rounded-lg bg-sage-600 px-6 py-3 font-semibold text-white hover:bg-sage-900 transition-colors disabled:opacity-60">
              {loading ? "..." : mode === "signup" ? "Créer mon compte" : "Se connecter"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "signup" ? (
              <>Déjà un compte ? <Link to="/auth" search={{ mode: "login", redirect }} className="font-semibold text-sage-600 hover:underline">Se connecter</Link></>
            ) : (
              <>Pas encore de compte ? <Link to="/auth" search={{ mode: "signup", redirect }} className="font-semibold text-sage-600 hover:underline">S'inscrire</Link></>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
