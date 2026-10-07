import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, CheckCircle2, Sparkles, ShieldCheck, CalendarCheck, GraduationCap, UserCheck, HeartHandshake, Gift, MessageCircle, Briefcase, Award } from "lucide-react";
import { track } from "@/lib/track";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CourseCard } from "@/components/site/CourseCard";
import { TrustBand } from "@/components/site/TrustBand";
import { FaqSection } from "@/components/site/Reassurance";
import { Reveal } from "@/components/site/Reveal";
// import { VideoTestimonials } from "@/components/site/VideoTestimonials";
import { coursesQuery } from "@/lib/courses";
import { PlansComparison } from "@/components/site/PlansComparison";
import { Testimonials } from "@/components/site/Testimonials";
import heroImg from "@/assets/hero-study.webp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cours d'anglais en ligne avec professeur | PolyLinguist" },
      { name: "description", content: "Améliorez votre anglais avec des cours individuels en ligne adaptés à votre niveau et vos objectifs. Testez gratuitement votre première séance." },
      { property: "og:title", content: "Cours d'anglais en ligne avec professeur | PolyLinguist" },
      { property: "og:description", content: "Améliorez votre anglais avec des cours individuels en ligne adaptés à votre niveau et vos objectifs. Testez gratuitement votre première séance." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(coursesQuery()),
  errorComponent: ({ error }) => <div className="p-8">{(error as Error).message}</div>,
  notFoundComponent: () => <div className="p-8">Introuvable</div>,
  component: Home,
});

const steps = [
  { title: "Réservez votre séance gratuite", text: "20 minutes pour parler avec un professeur et identifier vos besoins." },
  { title: "Recevez votre plan", text: "Nous vous recommandons une approche adaptée à votre niveau et votre objectif." },
  { title: "Progressez à votre rythme", text: "Cours individuels, professeur dédié et programme personnalisé." },
];

const goals = [
  { icon: MessageCircle, title: "Parler anglais avec aisance", text: "Pour ceux qui comprennent l'anglais mais manquent de confiance à l'oral.", cta: "Améliorer mon anglais oral", slug: "anglais-conversationnel" },
  { icon: Briefcase, title: "Anglais professionnel", text: "Pour les réunions, présentations, entretiens, emails et échanges professionnels.", cta: "Améliorer mon anglais professionnel", slug: "anglais-affaires" },
  { icon: Award, title: "Préparer un examen", text: "Préparation au TOEFL iBT avec un parcours structuré et des tests blancs.", cta: "Préparer mon examen", slug: "anglais-toefl" },
] as const;

const commitments = [
  { icon: UserCheck, title: "Cours 100 % individuels", text: "Un professeur dédié à votre progression, toute son attention est portée sur vous." },
  { icon: Sparkles, title: "Programme personnalisé", text: "Votre niveau et vos objectifs déterminent le contenu de chaque cours." },
  { icon: GraduationCap, title: "Professeurs sélectionnés", text: "Des enseignants diplômés, choisis pour leur expérience auprès des adultes et des professionnels." },
  { icon: CalendarCheck, title: "Flexible", text: "Réservez vos cours en ligne selon votre emploi du temps, de 8h à 22h." },
];

function TrialCta({ location, light = false }: { location: string; light?: boolean }) {
  return (
    <Link
      to="/essai-gratuit"
      onClick={() => { track("cta_click", { location }); track("free_trial_start", { location }); }}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-8 py-4 font-medium shadow-soft transition-all hover:-translate-y-0.5 ${light ? "bg-white text-sage-900" : "bg-sage-600 text-white"}`}
    >
      <Gift className="h-4 w-4" /> Je réserve ma séance gratuite
    </Link>
  );
}

function Home() {
  const { data: courses } = useSuspenseQuery(coursesQuery());
  const featured = courses.filter((c) => c.is_featured || c.slug === "cours-a-la-demande").slice(0, 4);

  return (
    <div className="min-h-screen bg-cream-100 text-sage-900">
      {/* Free trial banner — top of site */}
      <div className="bg-sage-900 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-2 px-6 py-3 text-center sm:flex-row sm:gap-4">
          <p className="text-sm">
            <span className="font-semibold">Séance d'essai gratuite</span>, testez une session en direct dans la catégorie de votre choix, sans engagement.
          </p>
          <Link to="/essai-gratuit" className="inline-flex items-center gap-1 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-sage-900 hover:-translate-y-0.5 transition-all">
            Réserver gratuitement <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      <Header />

      {/* Hero */}
      <header className="relative overflow-hidden pt-10 pb-20 md:pt-24 md:pb-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="max-w-xl">
              <span className="hero-enter mb-4 inline-block rounded-full bg-sage-100 px-3 py-1 text-xs font-semibold tracking-wider uppercase text-sage-600">
                Cours d'anglais individuels en ligne
              </span>
              <h1 className="hero-enter mb-6 font-serif text-5xl leading-[1.1] md:text-6xl" style={{ animationDelay: "120ms" }}>
                Parlez anglais avec <span className="italic">confiance</span>.
              </h1>
              <p className="hero-enter mb-8 text-lg text-sage-900/70 leading-relaxed" style={{ animationDelay: "240ms" }}>
                Des cours d'anglais individuels en ligne avec un professeur, adaptés à votre niveau, votre métier et vos objectifs.
              </p>
              <div className="hero-enter flex flex-col gap-3 sm:flex-row sm:items-center" style={{ animationDelay: "360ms" }}>
                <Link to="/essai-gratuit" onClick={() => { track("cta_click", { location: "hero" }); track("free_trial_start", { location: "hero" }); }} className="inline-flex items-center justify-center gap-2 rounded-lg bg-sage-600 px-8 py-4 text-lg font-semibold text-white shadow-soft transition-all hover:-translate-y-0.5">
                  <Gift className="h-5 w-5" /> Testez votre anglais gratuitement
                </Link>
                <Link to="/catalogue" onClick={() => track("cta_click", { location: "hero_secondary" })} className="inline-flex items-center justify-center gap-1 px-4 py-3 text-sm font-medium text-sage-600 hover:underline">
                  Découvrir nos cours <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <p className="hero-enter mt-3 text-sm font-medium text-sage-900/70" style={{ animationDelay: "420ms" }}>20 minutes · 100 % gratuit · Sans carte bancaire</p>
              <p className="hero-enter mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground" style={{ animationDelay: "480ms" }}>
                <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-sage-600" /> Paiement sécurisé</span>
                <span className="inline-flex items-center gap-1.5"><UserCheck className="h-3.5 w-3.5 text-sage-600" /> Cours 100 % individuels</span>
                <span className="inline-flex items-center gap-1.5"><HeartHandshake className="h-3.5 w-3.5 text-sage-600" /> Satisfait ou remboursé</span>
              </p>
            </div>
            <div className="hero-enter relative" style={{ animationDelay: "300ms" }}>
              <img src={heroImg} alt="Apprenante avec des écouteurs étudiant à son bureau" width={1024} height={768} fetchPriority="high" loading="eager" decoding="async" className="aspect-[4/3] w-full rounded-2xl object-cover shadow-soft" />
              <div className="animate-float-soft absolute -bottom-6 -left-6 rounded-xl bg-white p-6 shadow-soft">
                <div className="flex gap-2 mb-2">
                  <div className="h-2 w-12 rounded-full bg-sage-600"></div>
                  <div className="h-2 w-8 rounded-full bg-sage-100"></div>
                </div>
                <p className="text-xs font-bold">Progression : 65%</p>
                <p className="text-[10px] text-muted-foreground italic">Cours d'Anglais B1</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Free trial */}
      <section className="pb-20">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <div className="grid gap-8 rounded-3xl bg-white p-8 ring-1 ring-sage-100 md:grid-cols-[1.3fr_1fr] md:items-center md:p-12">
              <div>
                <h2 className="mb-3 font-serif text-3xl md:text-4xl">Votre première séance est offerte</h2>
                <p className="mb-6 text-sage-900/70">Découvrez votre niveau, échangez avec un professeur et repartez avec des conseils personnalisés pour progresser.</p>
                <TrialCta location="trial_block" />
              </div>
              <ul className="space-y-3">
                {["Évaluation de votre niveau", "Échange avec un professeur", "Conseils personnalisés"].map((b) => (
                  <li key={b} className="flex items-center gap-3 rounded-xl bg-cream-100 px-4 py-3 font-medium">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-sage-600" /> {b}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Trust figures */}
      <TrustBand />
      <Testimonials />

      {/* How it works */}
      <section id="how" className="py-24 bg-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-14">
            <h2 className="font-serif text-3xl md:text-4xl mb-3">Commencez simplement</h2>
            <p className="text-muted-foreground">Trois étapes, sans engagement.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 100} className="h-full">
                <div className="h-full rounded-2xl bg-cream-100 p-6 ring-1 ring-sage-100">
                  <div className="mb-3 font-serif text-4xl text-sage-600">0{i + 1}</div>
                  <h3 className="font-serif text-xl mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-10 text-center"><TrialCta location="how" /></div>
        </div>
      </section>

      {/* Goals */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-14">
            <h2 className="font-serif text-3xl md:text-4xl mb-3">Quel est votre objectif ?</h2>
            <p className="text-muted-foreground">Choisissez le parcours qui vous correspond.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {goals.map((g, i) => (
              <Reveal key={g.slug} delay={i * 80} className="h-full">
                <div className="flex h-full flex-col rounded-2xl bg-white p-6 ring-1 ring-sage-100">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-sage-100 text-sage-600"><g.icon className="h-5 w-5" /></div>
                  <h3 className="font-serif text-xl mb-2">{g.title}</h3>
                  <p className="mb-6 flex-1 text-sm text-muted-foreground leading-relaxed">{g.text}</p>
                  <Link to="/cours/$slug" params={{ slug: g.slug }} onClick={() => track("cta_click", { location: "goal", goal: g.slug })} className="inline-flex items-center gap-2 text-sm font-semibold text-sage-600 hover:underline">
                    {g.cta} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-14">
            <h2 className="font-serif text-3xl md:text-4xl mb-3">Pourquoi apprendre l'anglais avec PolyLinguist ?</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {commitments.map((c, i) => (
              <Reveal key={c.title} delay={i * 80} className="h-full">
                <div className="h-full rounded-2xl bg-cream-100 p-6 ring-1 ring-sage-100">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-sage-100 text-sage-600"><c.icon className="h-5 w-5" /></div>
                  <h3 className="font-serif text-xl mb-2">{c.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{c.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Offers */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-serif text-3xl mb-2">Nos offres</h2>
              <p className="text-muted-foreground">Un cours à l'unité ou un pack de 10 heures, au tarif horaire le plus avantageux.</p>
            </div>
            <Link to="/catalogue" className="inline-flex items-center gap-2 text-sm font-semibold text-sage-600 hover:underline">
              Voir tous les cours <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((c, i) => (
              <Reveal key={c.id} delay={i * 80} className="h-full">
                <CourseCard course={c} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <PlansComparison />

      <div className="mx-auto max-w-3xl px-6 pb-24"><FaqSection /></div>


      {/* CTA */}
      <section className="pb-24">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
          <div className="rounded-3xl bg-sage-900 p-12 md:p-16 text-center text-white">
            <h2 className="font-serif text-3xl md:text-4xl mb-4">Prêt à parler anglais avec confiance ?</h2>
            <p className="text-white/70 mb-8 max-w-xl mx-auto">
              Rejoignez plus de 1 000 étudiants. Commencez par une séance gratuite de 20 minutes, sans engagement.
            </p>
            <TrialCta location="final" light />
          </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
