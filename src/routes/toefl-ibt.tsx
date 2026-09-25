import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, Award, CheckCircle2, ArrowRight } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { TrustBand } from "@/components/site/TrustBand";
import { Reveal } from "@/components/site/Reveal";
import { FaqSection } from "@/components/site/Reassurance";

export const Route = createFileRoute("/toefl-ibt")({
  head: () => ({
    meta: [
      { title: "L'examen TOEFL iBT expliqué — PolyLinguist" },
      { name: "description", content: "Format, épreuves, score et inscription au TOEFL iBT : tout comprendre sur l'examen d'anglais le plus reconnu par les universités et entreprises, et découvrez notre parcours de préparation." },
      { property: "og:title", content: "L'examen TOEFL iBT expliqué — PolyLinguist" },
      { property: "og:description", content: "Format, épreuves, score et inscription au TOEFL iBT : tout comprendre avant de se présenter à l'examen." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ToeflPage,
});

const sections = [
  {
    name: "Reading",
    subtitle: "Compréhension écrite",
    duration: "35 min",
    detail: "Deux passages académiques, environ 20 questions à choix multiple. Vous mesurez votre capacité à comprendre, analyser et déduire un texte universitaire.",
  },
  {
    name: "Listening",
    subtitle: "Compréhension orale",
    duration: "36 min",
    detail: "Conférences et conversations de la vie universitaire, environ 28 questions. L'objectif : saisir le propos, l'intention et les détails importants.",
  },
  {
    name: "Speaking",
    subtitle: "Expression orale",
    duration: "16 min",
    detail: "Quatre tâches enregistrées face à votre micro : une question indépendante et trois tâches intégrées qui combinent lecture, écoute et réponse à l'oral.",
  },
  {
    name: "Writing",
    subtitle: "Expression écrite",
    duration: "29 min",
    detail: "Deux tâches : une rédaction intégrée (à partir d'un texte et d'un audio) et une dissertation d'opinion argumentée sur un sujet académique.",
  },
];

const keyFacts = [
  { label: "Durée totale", value: "Moins de 2 h" },
  { label: "Score maximum", value: "120 points" },
  { label: "Validité du score", value: "2 ans" },
  { label: "Résultats", value: "4 à 8 jours" },
];

const useCases = [
  "Admission en université, grande école ou programme d'échange à l'international",
  "Justification de son niveau d'anglais auprès d'un employeur ou d'un recruteur",
  "Dossiers de mobilité professionnelle et de visa dans certains pays",
  "Certification reconnue par des milliers d'établissements dans le monde",
];

export default function ToeflPage() {
  return (
    <div className="min-h-screen bg-cream-100 text-sage-900">
      <Header />
      <TrustBand />

      <main className="mx-auto max-w-4xl px-6 py-16">
        <Reveal>
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
            Tout savoir sur l'examen
          </div>
          <h1 className="font-serif text-4xl md:text-5xl mb-5">Le TOEFL iBT, c'est quoi ?</h1>
          <p className="text-sage-900/80 leading-relaxed text-lg mb-4">
            Le TOEFL iBT (Test of English as a Foreign Language, internet-Based Test) est l'examen d'anglais académique de référence, conçu et administré par ETS. Il évalue votre capacité à utiliser l'anglais dans un contexte universitaire ou professionnel : comprendre des cours, des discussions, des textes et y répondre à l'écrit comme à l'oral.
          </p>
          <p className="text-sage-900/80 leading-relaxed">
            Il se passe entièrement sur ordinateur, dans un centre d'examen agréé, en une seule session de moins de deux heures. Votre score sur 120 points est reconnu par des milliers d'universités, de grandes écoles et d'entreprises dans le monde entier.
          </p>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {keyFacts.map((f) => (
              <div key={f.label} className="rounded-2xl bg-white p-5 text-center ring-1 ring-sage-100">
                <div className="font-serif text-xl font-bold text-sage-600">{f.value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{f.label}</div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={80}>
          <section className="mt-16">
            <h2 className="font-serif text-3xl mb-2">Les 4 épreuves</h2>
            <p className="mb-8 text-muted-foreground">Le score final sur 120 correspond à l'addition des quatre épreuves, notées chacune sur 30.</p>
            <div className="grid gap-4 md:grid-cols-2">
              {sections.map((s, i) => (
                <div key={s.name} className="rounded-2xl bg-white p-6 ring-1 ring-sage-100 shadow-soft">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-sage-100 text-xs font-bold text-sage-600">{i + 1}</span>
                      <div>
                        <div className="font-semibold">{s.name}</div>
                        <div className="text-xs text-muted-foreground">{s.subtitle}</div>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3.5 w-3.5" /> {s.duration}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-sage-900/80">{s.detail}</p>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal delay={80}>
          <section className="mt-16">
            <h2 className="font-serif text-3xl mb-6">À quoi sert le TOEFL iBT ?</h2>
            <ul className="space-y-3">
              {useCases.map((u) => (
                <li key={u} className="flex items-start gap-3 rounded-xl bg-white p-4 ring-1 ring-sage-100">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sage-600" />
                  <span className="text-sm text-sage-900/80">{u}</span>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>

        <Reveal delay={80}>
          <section className="mt-16">
            <h2 className="font-serif text-3xl mb-4">L'inscription à l'examen</h2>
            <div className="rounded-2xl bg-white p-6 ring-1 ring-sage-100">
              <p className="text-sage-900/80 leading-relaxed mb-4">
                L'inscription au TOEFL iBT se fait auprès d'ITS, le fournisseur officiel du TOEFL iBT. Elle coûte <strong>310 €</strong> et se règle directement auprès d'ITS, indépendamment de votre préparation. Vous choisissez ensuite votre date et votre centre d'examen parmi les sessions proposées toute l'année.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Dans notre parcours certifiant, l'inscription à l'examen est incluse : nous vous accompagnons dans le choix de votre date, et les 310 € d'inscription sont réglés directement auprès d'ITS.
              </p>
            </div>
          </section>
        </Reveal>

        <Reveal delay={80}>
          <section className="mt-16">
            <h2 className="font-serif text-3xl mb-4">Interpréter son score</h2>
            <p className="text-sage-900/80 leading-relaxed mb-6">
              Le score sur 120 se lit par épreuve (sur 30) et au global. La plupart des universités demandent un score global entre 80 et 100, avec parfois un minimum de 20 à 25 par épreuve. Les objectifs les plus sélectifs (certaines écoles de commerce ou programmes d'élite) montent au-delà de 100.
            </p>
            <div className="overflow-hidden rounded-2xl ring-1 ring-sage-100">
              <table className="w-full bg-white text-sm">
                <tbody>
                  {[
                    ["Moins de 60", "Niveau intermédiaire — suffisant pour certains échanges, souvent renforcé en préparation"],
                    ["60 à 79", "Niveau correct — accepté par de nombreuses universités et programmes"],
                    ["80 à 99", "Bon niveau — exigé par la majorité des grandes écoles et universités"],
                    ["100 et plus", "Excellent niveau — objectifs les plus sélectifs et dossiers de premier plan"],
                  ].map(([range, meaning], i) => (
                    <tr key={range} className={i % 2 === 0 ? "" : "bg-cream-100/60"}>
                      <td className="px-5 py-3.5 font-semibold text-sage-600 whitespace-nowrap align-top">{range}</td>
                      <td className="px-5 py-3.5 text-sage-900/80">{meaning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </Reveal>

        <Reveal delay={80}>
          <section className="mt-16">
            <h2 className="font-serif text-3xl mb-4">Comment PolyLinguist vous prépare</h2>
            <p className="text-sage-900/80 leading-relaxed mb-6">
              Notre parcours certifiant vous prépare aux quatre épreuves du TOEFL iBT en cours individuels en direct : dix séances de 60 minutes en tête-à-tête avec un professeur certifié, deux tests blancs complets, des fiches de vocabulaire après chaque séance et un plan d'action personnalisé. L'inscription à l'examen est incluse dans le parcours.
            </p>
            <div className="rounded-2xl bg-white p-6 ring-1 ring-sage-100 shadow-soft">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="font-serif text-2xl font-bold text-sage-600">759 €</div>
                  <div className="text-xs text-muted-foreground">dont 310 € d'inscription à l'examen (ITS)</div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/cours/anglais-toefl"
                    className="inline-flex items-center gap-2 rounded-lg bg-sage-600 px-5 py-3 font-semibold text-white hover:bg-sage-900 transition-colors"
                  >
                    Découvrir le parcours <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to="/essai-gratuit"
                    className="inline-flex items-center rounded-lg border border-sage-600 px-5 py-3 font-semibold text-sage-600 hover:bg-sage-50 transition-colors"
                  >
                    Séance d'essai gratuite
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal delay={80}>
          <section className="mt-16">
            <h2 className="font-serif text-3xl mb-4">Questions fréquentes</h2>
            <FaqSection />
          </section>
        </Reveal>

        <div className="mt-16 text-center">
          <Link to="/catalogue" className="text-sm font-semibold text-sage-600 hover:underline">← Retour au catalogue</Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
