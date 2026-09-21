import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, BookOpen, CheckCircle2, Users, Sparkles, Wallet } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CourseCard } from "@/components/site/CourseCard";
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

import coursAnglaisImg from "@/assets/cours-anglais.jpg";

const languages = [
  { name: "Anglais", image: coursAnglaisImg },
];

const steps = [
  { icon: Sparkles, title: "Choisissez votre parcours", text: "Parcourez notre catalogue et trouvez le cours adapté à votre niveau et vos objectifs." },
  { icon: BookOpen, title: "Réservez vos sessions en direct", text: "Choisissez les créneaux qui vous conviennent et rejoignez votre professeur en visioconférence." },
  { icon: Users, title: "Pratiquez avec des natifs", text: "Échangez avec nos professeurs certifiés et progressez en conversation réelle." },
  { icon: CheckCircle2, title: "Mesurez vos progrès", text: "Suivez votre progression dans votre espace personnel et obtenez vos certificats." },
];

const testimonials = [
  { name: "Clara D.", quote: "Une approche radicalement différente. Les sessions en direct m'ont permis de prendre la parole en anglais sans stress.", course: "Anglais Conversationnel" },
  { name: "Julien R.", quote: "Pouvoir réserver mes créneaux selon mon agenda a tout changé. Le contenu est très structuré et concret.", course: "Business English" },
  { name: "Sarah W.", quote: "Grâce aux sessions live et au suivi personnalisé, j'ai atteint mon objectif de score en quelques mois.", course: "Parcours certifiant TOEFL" },
];

function Home() {
  const { data: courses } = useSuspenseQuery(coursesQuery());
  const featured = courses.filter((c) => c.is_featured).slice(0, 3);

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
                Apprentissage immersif
              </span>
              <h1 className="mb-6 font-serif text-5xl leading-[1.1] md:text-6xl">
                Maîtrisez l'Anglais avec <span className="italic">assurance</span>.
              </h1>
              <p className="mb-8 text-lg text-sage-900/70 leading-relaxed">
                Des sessions en direct avec des professeurs certifiés, à réserver selon vos disponibilités, pour transformer votre apprentissage en réussite.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/catalogue" className="rounded-lg bg-sage-600 px-8 py-4 font-medium text-white shadow-soft hover:-translate-y-0.5 transition-all">
                  Découvrir le catalogue
                </Link>
                <a href="#how" className="rounded-lg border border-sage-100 bg-white px-8 py-4 font-medium hover:bg-sage-50 transition-colors">
                  Comment ça marche
                </a>
              </div>
            </div>
            <div className="relative">
              <img src={heroImg} alt="Apprenante avec des écouteurs étudiant à son bureau" width={1024} height={768} className="aspect-[4/3] w-full rounded-2xl object-cover shadow-soft" />
              <div className="absolute -bottom-6 -left-6 rounded-xl bg-white p-6 shadow-soft">
                <div className="flex gap-2 mb-2">
                  <div className="h-2 w-12 rounded-full bg-sage-600"></div>
                  <div className="h-2 w-8 rounded-full bg-sage-100"></div>
                </div>
                <p className="text-xs font-bold">Progression : 65%</p>
                <p className="text-[10px] text-muted-foreground italic">Cours d'Italien B1</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Languages */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-serif text-3xl">Apprenez ce qui vous passionne</h2>
            <Link to="/catalogue" className="text-sm font-semibold text-sage-600 hover:underline">
              Voir tout le catalogue →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 max-w-sm">
            {languages.map((l) => {
              const count = courses.filter((c) => c.language === l.name).length;
              return (
                <Link
                  key={l.name}
                  to="/catalogue"
                  search={{ langue: l.name }}
                  className="group cursor-pointer rounded-2xl border border-sage-50 p-6 text-center transition-all hover:bg-cream-100 hover:shadow-card"
                >
                  <img src={l.image} alt={`Apprenante suivant un cours d'${l.name.toLowerCase()} en ligne`} width={1024} height={1024} loading="lazy" className="mx-auto mb-4 size-24 rounded-full object-cover ring-2 ring-sage-100 group-hover:scale-105 transition-transform" />
                  <h3 className="font-medium">{l.name}</h3>
                  <p className="text-xs text-muted-foreground">{count} {count > 1 ? "cours disponibles" : "cours disponible"}</p>
                </Link>
              );
            })}
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
              Tout voir <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((c) => <CourseCard key={c.id} course={c} />)}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-sage-50/50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl mb-3">Comment ça marche ?</h2>
            <p className="text-muted-foreground">Quatre étapes simples pour apprendre durablement.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.title} className="rounded-2xl bg-white p-6 ring-1 ring-sage-100">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-sage-100 text-sage-600">
                  <s.icon className="h-5 w-5" />
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Étape {i + 1}</div>
                <h3 className="font-serif text-xl mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.text}</p>
              </div>
            ))}
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

      {/* CTA */}
      <section className="pb-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="rounded-3xl bg-sage-900 p-12 md:p-16 text-center text-white">
            <h2 className="font-serif text-3xl md:text-4xl mb-4">Prêt à commencer l'aventure ?</h2>
            <p className="text-white/70 mb-8 max-w-xl mx-auto">
              Rejoignez plus de 10 000 apprenants qui ont transformé leur manière d'apprendre les langues.
            </p>
            <Link to="/catalogue" className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 font-medium text-sage-900 hover:-translate-y-0.5 transition-all">
              Explorer les cours <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
