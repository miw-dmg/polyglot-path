import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, BookOpen, CheckCircle2, Users, Sparkles, Wallet, ShieldCheck, CalendarCheck, GraduationCap, UserCheck, HeartHandshake } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CourseCard } from "@/components/site/CourseCard";
import { TrustBand } from "@/components/site/TrustBand";
import { FaqSection } from "@/components/site/Reassurance";
import { coursesQuery } from "@/lib/courses";
import heroImg from "@/assets/hero-study.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Linguist — Cours d'anglais en direct, sessions à réserver" },
      { name: "description", content: "Apprenez l'anglais avec des sessions en direct à réserver selon vos disponibilités : conversation, anglais des affaires et préparation certifiante TOEFL." },
      { property: "og:title", content: "Linguist — Cours d'anglais en direct" },
      { property: "og:description", content: "Apprenez l'anglais avec assurance. Sessions en direct avec des professeurs certifiés, à réserver en ligne." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(coursesQuery()),
  errorComponent: ({ error }) => <div className="p-8">{error.message}</div>,
  notFoundComponent: () => <div className="p-8">Introuvable</div>,
  component: Home,
});

const steps = [
  { icon: Sparkles, title: "Choisissez votre catégorie", text: "Conversation, anglais des affaires ou parcours certifiant : sélectionnez le cours adapté à votre objectif." },
  { icon: BookOpen, title: "Sélectionnez un créneau", text: "Parcourez les sessions individuelles en direct disponibles et réservez la date et l'heure qui vous conviennent." },
  { icon: Users, title: "Payez en toute sécurité", text: "Paiement par carte en quelques clics, sans création de compte. Votre place est confirmée immédiatement." },
  { icon: CheckCircle2, title: "Rejoignez la session en direct", text: "Recevez votre lien de visioconférence par e-mail et connectez-vous au jour et à l'heure choisis." },
];

const testimonials = [
  { name: "Clara D.", quote: "Une approche radicalement différente. Les sessions en direct m'ont permis de prendre la parole en anglais sans stress.", course: "Anglais Conversationnel" },
  { name: "Julien R.", quote: "Pouvoir réserver mes créneaux selon mon agenda a tout changé. Le contenu est très structuré et concret.", course: "Business English" },
  { name: "Sarah W.", quote: "Grâce aux sessions live et au suivi personnalisé, j'ai atteint mon objectif de score en quelques mois.", course: "Parcours certifiant TOEFL" },
];

const commitments = [
  { icon: GraduationCap, title: "Professeurs certifiés", text: "Nos professeurs sont diplômés et sélectionnés pour leur expérience de l'enseignement aux professionnels." },
  { icon: UserCheck, title: "Cours individuels en direct", text: "Chaque session est un tête-à-tête : toute l'attention du professeur est portée sur vous." },
  { icon: ShieldCheck, title: "Paiement sécurisé", text: "Le paiement par carte est traité par Shopify. Aucune donnée bancaire ne transite sur notre site." },
  { icon: HeartHandshake, title: "Satisfait ou remboursé", text: "Si une session ne vous convient pas, nous vous remboursons. Notre objectif : que chaque cours soit un vrai plus pour vous." },
  { icon: CalendarCheck, title: "Créneau garanti", text: "Votre place est confirmée immédiatement après le paiement : le créneau est réservé pour vous." },
  { icon: Sparkles, title: "Séance d'essai gratuite", text: "Testez une session en direct dans la catégorie de votre choix, sans engagement." },
];

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
      <header className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="max-w-xl">
              <span className="mb-4 inline-block rounded-full bg-sage-100 px-3 py-1 text-xs font-semibold tracking-wider uppercase text-sage-600">
                Cours individuels en direct
              </span>
              <h1 className="mb-6 font-serif text-5xl leading-[1.1] md:text-6xl">
                Maîtrisez l'Anglais avec <span className="italic">assurance</span>.
              </h1>
              <p className="mb-8 text-lg text-sage-900/70 leading-relaxed">
                Des cours individuels en tête-à-tête avec un professeur certifié, en sessions en direct à réserver selon vos disponibilités, pour transformer votre apprentissage en réussite.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/catalogue" className="rounded-lg bg-sage-600 px-8 py-4 font-medium text-white shadow-soft hover:-translate-y-0.5 transition-all">
                  Je réserve en ligne
                </Link>
                <Link to="/essai-gratuit" className="rounded-lg border border-sage-100 bg-white px-8 py-4 font-medium hover:bg-sage-50 transition-colors">
                  Séance d'essai gratuite
                </Link>
              </div>
              <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-sage-600" /> Paiement sécurisé</span>
                <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-sage-600" /> Sans compte requis</span>
                <span className="inline-flex items-center gap-1.5"><Wallet className="h-3.5 w-3.5 text-sage-600" /> CPF accepté</span>
                <span className="inline-flex items-center gap-1.5"><HeartHandshake className="h-3.5 w-3.5 text-sage-600" /> Satisfait ou remboursé</span>
              </p>
            </div>
            <div className="relative">
              <img src={heroImg} alt="Apprenante avec des écouteurs étudiant à son bureau" width={1024} height={768} className="aspect-[4/3] w-full rounded-2xl object-cover shadow-soft" />
              <div className="absolute -bottom-6 -left-6 rounded-xl bg-white p-6 shadow-soft">
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

      {/* Trust figures */}
      <TrustBand />

      {/* How it works */}
      <section id="how" className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl mb-3">Comment ça marche ?</h2>
            <p className="text-muted-foreground">Réservez votre session en direct en quatre étapes simples.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.title} className="rounded-2xl bg-cream-100 p-6 ring-1 ring-sage-100">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-sage-100 text-sage-600">
                  <s.icon className="h-5 w-5" />
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Étape {i + 1}</div>
                <h3 className="font-serif text-xl mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/catalogue" className="inline-flex items-center gap-2 rounded-lg bg-sage-600 px-8 py-4 font-medium text-white shadow-soft transition-all hover:-translate-y-0.5">
              Je réserve en ligne <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured courses */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-serif text-3xl mb-2">Cours populaires</h2>
              <p className="text-muted-foreground">Sélectionnés pour leur qualité pédagogique.</p>
            </div>
            <Link to="/catalogue" className="inline-flex items-center gap-2 text-sm font-semibold text-sage-600 hover:underline">
              Je réserve en ligne <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((c) => <CourseCard key={c.id} course={c} />)}
          </div>
        </div>
      </section>

      {/* CPF */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-4xl px-6">
          <div className="flex flex-col items-center gap-6 rounded-3xl bg-sage-50/70 p-8 text-center md:flex-row md:text-left">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-sage-600 text-white">
              <Wallet className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-serif text-2xl mb-2">Financement CPF accepté en France</h2>
              <p className="text-sage-900/70 leading-relaxed">
                Nos parcours certifiants sont éligibles au Compte Personnel de Formation (CPF). Vous pouvez utiliser vos heures CPF pour financer tout ou partie de votre formation. Notre équipe vous accompagne pas à pas dans la constitution de votre dossier.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="font-serif text-3xl text-center mb-16">Ils apprennent avec nous</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((t) => (
              <blockquote key={t.name} className="rounded-2xl bg-white p-8 ring-1 ring-sage-100">
                <p className="italic text-sage-900/80 leading-relaxed mb-6">"{t.quote}"</p>
                <footer>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.course}</div>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* Commitments */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-14">
            <h2 className="font-serif text-3xl md:text-4xl mb-3">Nos engagements</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Ce à quoi vous pouvez nous tenir, à chaque étape de votre apprentissage.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {commitments.map((c) => (
              <div key={c.title} className="rounded-2xl bg-cream-100 p-6 ring-1 ring-sage-100">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-sage-100 text-sage-600">
                  <c.icon className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-xl mb-2">{c.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      <div className="mx-auto max-w-3xl px-6 pb-24"><FaqSection /></div>

      {/* CTA */}
      <section className="pb-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="rounded-3xl bg-sage-900 p-12 md:p-16 text-center text-white">
            <h2 className="font-serif text-3xl md:text-4xl mb-4">Prêt à commencer l'aventure ?</h2>
            <p className="text-white/70 mb-8 max-w-xl mx-auto">
              Rejoignez plus de 1000 étudiants qui ont transformé leur manière d'apprendre l'anglais.
            </p>
            <Link to="/catalogue" className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 font-medium text-sage-900 hover:-translate-y-0.5 transition-all">
              Je réserve en ligne <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
