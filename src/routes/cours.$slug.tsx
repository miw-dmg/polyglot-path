import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Star, Clock, Award, CheckCircle2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { courseBySlugQuery, courseImage, levelLabels, formatLabels } from "@/lib/courses";
import coursAnglaisImg from "@/assets/cours-anglais.jpg";
import { useCart, formatPrice } from "@/lib/cart";

export const Route = createFileRoute("/cours/$slug")({
  loader: async ({ context, params }) => {
    const course = await context.queryClient.ensureQueryData(courseBySlugQuery(params.slug));
    if (!course) throw notFound();
    return course;
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.title} — Linguist` },
      { name: "description", content: loaderData.summary ?? loaderData.description ?? "" },
      { property: "og:title", content: loaderData.title },
      { property: "og:description", content: loaderData.summary ?? "" },
      ...(courseImage(loaderData) ? [{ property: "og:image", content: courseImage(loaderData)! }] : []),
    ] : [],
  }),
  errorComponent: ({ error }) => <div className="p-8">{error.message}</div>,
  notFoundComponent: () => (
    <div className="min-h-screen bg-cream-100">
      <Header />
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-serif text-3xl">Cours introuvable</h1>
        <Link to="/catalogue" className="mt-6 inline-block text-sage-600 font-semibold hover:underline">← Retour au catalogue</Link>
      </div>
    </div>
  ),
  component: CoursePage,
});

function CoursePage() {
  const { slug } = Route.useParams();
  const { data: course } = useSuspenseQuery(courseBySlugQuery(slug));
  const cart = useCart();
  if (!course) return null;

  const img = courseImage(course) ?? coursAnglaisImg;
  const inCart = cart.items.some((i) => i.courseId === course.id);

  function addToCart() {
    if (!course) return;
    const ok = cart.add({
      courseId: course.id,
      slug: course.slug,
      title: course.title,
      priceCents: course.price_cents,
      imageUrl: course.image_url,
      language: course.language,
      format: course.format,
    });
    if (ok) toast.success("Ajouté au panier");
    else toast.info("Déjà dans votre panier");
  }

  return (
    <div className="min-h-screen bg-cream-100 text-sage-900">
      <Header />

      <div className="mx-auto max-w-6xl px-6 py-12">
        <Link to="/catalogue" className="text-sm text-muted-foreground hover:text-sage-600">← Retour au catalogue</Link>

        <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_380px]">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
              {course.language} · {levelLabels[course.level]} · {formatLabels[course.format]}
            </div>
            <h1 className="font-serif text-4xl md:text-5xl mb-4">{course.title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
              <span className="inline-flex items-center gap-1"><Star className="h-4 w-4 fill-sage-600 text-sage-600" /> {course.rating} ({course.reviews_count} avis)</span>
              {course.duration_hours && <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" /> {course.duration_hours}h</span>}
              <span className="inline-flex items-center gap-1"><Award className="h-4 w-4" /> Certificat inclus</span>
            </div>

            <img src={img} alt={course.title} loading="lazy" width={1024} height={1024} className="aspect-video w-full rounded-2xl object-cover shadow-soft mb-10" />

            <section className="mb-10">
              <h2 className="font-serif text-2xl mb-4">Description</h2>
              <p className="text-sage-900/80 leading-relaxed">{course.description}</p>
            </section>

            {course.prerequisites && (
              <section className="mb-10">
                <h2 className="font-serif text-2xl mb-4">Prérequis</h2>
                <p className="text-sage-900/80">{course.prerequisites}</p>
              </section>
            )}

            {course.curriculum.length > 0 && (
              <section className="mb-10">
                <h2 className="font-serif text-2xl mb-4">Programme</h2>
                <ol className="space-y-3">
                  {course.curriculum.map((m, i) => (
                    <li key={i} className="flex items-center justify-between rounded-xl border border-sage-100 bg-white p-4">
                      <div className="flex items-center gap-4">
                        <span className="grid h-8 w-8 place-items-center rounded-full bg-sage-100 text-xs font-bold text-sage-600">{i + 1}</span>
                        <span className="font-medium">{m.title}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{m.duration}</span>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            <section>
              <h2 className="font-serif text-2xl mb-4">Avis</h2>
              <div className="space-y-4">
                {[
                  { name: "Émilie B.", text: "Très bonne pédagogie, je recommande vivement.", stars: 5 },
                  { name: "Marc P.", text: "Contenu de grande qualité, j'ai beaucoup progressé.", stars: 5 },
                ].map((r) => (
                  <div key={r.name} className="rounded-xl bg-white p-5 ring-1 ring-sage-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm">{r.name}</span>
                      <span className="flex">{Array.from({ length: r.stars }).map((_, i) => <Star key={i} className="h-3 w-3 fill-sage-600 text-sage-600" />)}</span>
                    </div>
                    <p className="text-sm text-sage-900/80">{r.text}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sticky purchase */}
          <aside className="lg:sticky lg:top-24 self-start">
            <div className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-sage-100">
              <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {formatLabels[course.format]}
              </div>
              <div className="mb-6 flex items-baseline gap-2">
                <span className="font-serif text-4xl font-bold text-sage-600">{formatPrice(course.price_cents)}</span>
                {course.format === "abonnement" && <span className="text-sm text-muted-foreground">/mois</span>}
              </div>
              <button
                onClick={addToCart}
                className="w-full rounded-lg bg-sage-600 px-6 py-3.5 font-semibold text-white hover:bg-sage-900 transition-colors inline-flex items-center justify-center gap-2"
              >
                <ShoppingBag className="h-4 w-4" />
                {inCart ? "Dans le panier" : "Ajouter au panier"}
              </button>
              <Link to="/panier" className="mt-2 block w-full text-center rounded-lg border border-sage-600 px-6 py-3 font-semibold text-sage-600 hover:bg-sage-50 transition-colors">
                Voir le panier
              </Link>
              <ul className="mt-6 space-y-3 text-sm text-sage-900/80">
                {["Accès à vie aux contenus", "Certificat de réussite", "Support pédagogique inclus", "Garantie 30 jours satisfait ou remboursé"].map((f) => (
                  <li key={f} className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sage-600" /> {f}</li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
