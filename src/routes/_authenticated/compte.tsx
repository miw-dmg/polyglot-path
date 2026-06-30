import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LogOut, FileText, BookOpen } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/cart";
import { resolveImage } from "@/lib/courses";

export const Route = createFileRoute("/_authenticated/compte")({
  head: () => ({ meta: [{ title: "Mon compte — Linguist" }] }),
  component: Account,
});

type EnrollmentRow = { id: string; progress: number; enrolled_at: string; courses: { id: string; slug: string; title: string; language: string; language_flag: string | null; image_url: string | null; level: string } | null };
type OrderRow = { id: string; total_cents: number; status: string; created_at: string; order_items: { course_title: string; price_cents: number }[] };

function Account() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [tab, setTab] = useState<"cours" | "factures">("cours");
  const [name, setName] = useState<string>("");

  useEffect(() => {
    supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle().then(({ data }) => {
      setName(data?.full_name ?? user.email?.split("@")[0] ?? "");
    });
  }, [user]);

  const { data: enrollments } = useQuery({
    queryKey: ["enrollments", user.id],
    queryFn: async (): Promise<EnrollmentRow[]> => {
      const { data, error } = await supabase
        .from("enrollments")
        .select("id, progress, enrolled_at, courses ( id, slug, title, language, language_flag, image_url, level )")
        .eq("user_id", user.id)
        .order("enrolled_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as EnrollmentRow[];
    },
  });

  const { data: orders } = useQuery({
    queryKey: ["orders", user.id],
    queryFn: async (): Promise<OrderRow[]> => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, total_cents, status, created_at, order_items ( course_title, price_cents )")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as OrderRow[];
    },
  });

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", search: { mode: "login" }, replace: true });
  }

  async function updateProgress(id: string, progress: number) {
    await supabase.from("enrollments").update({ progress }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["enrollments", user.id] });
  }

  const initials = name ? name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase() : "??";
  const avgProgress = enrollments && enrollments.length > 0
    ? Math.round(enrollments.reduce((s, e) => s + e.progress, 0) / enrollments.length)
    : 0;

  return (
    <div className="min-h-screen bg-cream-100 text-sage-900">
      <Header />

      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="rounded-3xl bg-white p-8 md:p-12 shadow-soft ring-1 ring-sage-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div className="flex items-center gap-4">
              <div className="size-16 rounded-full bg-cream-200 grid place-items-center font-serif text-2xl font-bold text-sage-600">{initials}</div>
              <div>
                <h1 className="text-2xl font-serif font-semibold">Bon retour{name ? `, ${name}` : ""}</h1>
                <p className="text-sm text-muted-foreground">
                  {enrollments?.length ?? 0} cours · progression moyenne {avgProgress}%
                </p>
              </div>
            </div>
            <button onClick={signOut} className="inline-flex items-center gap-2 rounded-lg border border-sage-100 px-4 py-2 text-sm font-medium hover:bg-sage-50">
              <LogOut className="h-4 w-4" /> Déconnexion
            </button>
          </div>

          <div className="flex gap-2 mb-8 border-b border-sage-100">
            <TabBtn active={tab === "cours"} onClick={() => setTab("cours")}><BookOpen className="h-4 w-4" /> Mes cours</TabBtn>
            <TabBtn active={tab === "factures"} onClick={() => setTab("factures")}><FileText className="h-4 w-4" /> Factures</TabBtn>
          </div>

          {tab === "cours" && (
            enrollments && enrollments.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {enrollments.map((e) => {
                  if (!e.courses) return null;
                  const img = resolveImage(e.courses.image_url, e.courses.language);
                  return (
                    <div key={e.id} className="rounded-2xl border border-sage-100 bg-cream-100/40 p-4">
                      <div className="flex gap-4 mb-3">
                        <div className="size-20 shrink-0 overflow-hidden rounded-lg bg-sage-100 grid place-items-center">
                          {img ? <img src={img} alt="" className="h-full w-full object-cover" /> : <span className="text-3xl">{e.courses.language_flag}</span>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{e.courses.language}</div>
                          <Link to="/cours/$slug" params={{ slug: e.courses.slug }} className="font-semibold hover:text-sage-600 line-clamp-1">{e.courses.title}</Link>
                          <div className="mt-2 h-1.5 w-full rounded-full bg-white">
                            <div className="h-1.5 rounded-full bg-sage-600 transition-all" style={{ width: `${e.progress}%` }}></div>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">{e.progress}% complété</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => updateProgress(e.id, Math.min(100, e.progress + 25))} className="flex-1 rounded-lg bg-sage-600 px-3 py-2 text-xs font-semibold text-white hover:bg-sage-900">
                          {e.progress === 0 ? "Commencer" : "Continuer"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <Empty msg="Vous n'avez pas encore de cours." cta="Explorer le catalogue" to="/catalogue" />
            )
          )}

          {tab === "factures" && (
            orders && orders.length > 0 ? (
              <div className="space-y-3">
                {orders.map((o) => (
                  <div key={o.id} className="rounded-xl border border-sage-100 bg-white p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <div>
                        <div className="font-mono text-xs text-muted-foreground">#{o.id.slice(0, 8).toUpperCase()}</div>
                        <div className="text-sm">{new Date(o.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-serif text-lg font-bold text-sage-600">{formatPrice(o.total_cents)}</div>
                        <div className="text-xs text-muted-foreground capitalize">{o.status === "completed" ? "Payée" : o.status}</div>
                      </div>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {o.order_items.map((i, idx) => (
                        <li key={idx} className="flex justify-between"><span>{i.course_title}</span><span>{formatPrice(i.price_cents)}</span></li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <Empty msg="Aucune facture pour le moment." cta="Voir les cours" to="/catalogue" />
            )
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 -mb-px transition-colors ${active ? "border-sage-600 text-sage-600" : "border-transparent text-muted-foreground hover:text-sage-900"}`}>
      {children}
    </button>
  );
}

function Empty({ msg, cta, to }: { msg: string; cta: string; to: "/catalogue" }) {
  return (
    <div className="rounded-2xl border border-dashed border-sage-100 p-12 text-center">
      <p className="text-muted-foreground mb-4">{msg}</p>
      <Link to={to} className="inline-block rounded-lg bg-sage-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sage-900">{cta}</Link>
    </div>
  );
}
