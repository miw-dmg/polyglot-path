import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShoppingBag, User as UserIcon, Menu, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/lib/cart";
import type { User } from "@supabase/supabase-js";

export function Header() {
  const navigate = useNavigate();
  const { count } = useCart();
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const links = [
    { to: "/catalogue", label: "Catalogue" },
    { to: "/a-propos", label: "À propos" },
    { to: "/contact", label: "Contact" },
  ] as const;

  return (
    <nav className="sticky top-0 z-50 border-b border-sage-100 bg-cream-100/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link to="/" className="font-serif text-2xl font-bold tracking-tight text-sage-600 underline decoration-sage-100 underline-offset-4">
            Linguist.
          </Link>
          <div className="hidden gap-6 md:flex">
            {links.map((l) => (
              <Link key={l.to} to={l.to} className="text-sm font-medium hover:text-sage-600 transition-colors" activeProps={{ className: "text-sage-600" }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/panier" className="relative inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-sage-50 transition-colors" aria-label="Panier">
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-sage-600 px-1 text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
          {user ? (
            <Link to="/compte" className="hidden sm:inline-flex h-10 items-center gap-2 rounded-full border border-sage-100 bg-white px-4 text-sm font-medium hover:bg-sage-50">
              <UserIcon className="h-4 w-4" /> Mon compte
            </Link>
          ) : (
            <>
              <Link to="/auth" className="hidden sm:inline-block text-sm font-medium">
                Connexion
              </Link>
              <button
                onClick={() => navigate({ to: "/auth", search: { mode: "signup" } })}
                className="hidden sm:inline-block rounded-full bg-sage-600 px-5 py-2 text-sm font-medium text-white hover:bg-sage-900 transition-colors shadow-sm"
              >
                S'inscrire
              </button>
            </>
          )}
          <button onClick={() => setOpen((o) => !o)} className="inline-flex md:hidden h-10 w-10 items-center justify-center rounded-full hover:bg-sage-50">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-sage-100 bg-cream-100 px-6 py-4 flex flex-col gap-3">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="text-sm font-medium">
              {l.label}
            </Link>
          ))}
          {user ? (
            <Link to="/compte" onClick={() => setOpen(false)} className="text-sm font-medium">Mon compte</Link>
          ) : (
            <Link to="/auth" onClick={() => setOpen(false)} className="text-sm font-medium">Connexion / Inscription</Link>
          )}
        </div>
      )}
    </nav>
  );
}
