import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Gift, ShieldCheck, UserCheck, CalendarCheck } from "lucide-react";
import { TrustBand } from "@/components/site/TrustBand";
import { FaqSection } from "@/components/site/Reassurance";
import { track } from "@/lib/track";
import logoAsset from "@/assets/polylinguist-logo.png.asset.json";
import heroImg from "@/assets/hero-study.webp";

const TITLE = "Cours d'anglais conversation en ligne | PolyLinguist";
const DESC = "Vous comprenez l'anglais mais vous bloquez à l'oral ? Testez gratuitement une séance individuelle de 20 minutes avec un professeur.";

export const Route = createFileRoute("/anglais-conversation")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ConversationLanding,
});

function Cta({ location }: { location: string }) {
  return (
    <Link
      to="/essai-gratuit"
      onClick={() => { track("cta_click", { location, page: "anglais-conversation" }); track("free_trial_start", { location }); }}
      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-sage-600 px-8 py-4 text-lg font-semibold text-white shadow-soft transition-all hover:-translate-y-0.5 sm:w-auto"
    >
      <Gift className="h-5 w-5" /> Testez votre anglais gratuitement
    </Link>
  );
}

const pains = [
  "Vous comprenez, mais les mots ne viennent pas au moment de parler.",
  "Vous avez peur de faire des fautes devant les autres.",
  "Vous évitez les appels ou les réunions en anglais.",
];

function ConversationLanding() {
  return (
    <div className="min-h-screen bg-cream-100 text-sage-900">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" aria-label="PolyLinguist — accueil"><img src={logoAsset.url} alt="PolyLinguist" className="h-8 w-auto" /></Link>
        <a href="tel:+33628540270" className="text-sm font-medium hover:text-sage-600">+33 6 28 54 02 70</a>
      </div>

      <header className="pt-8 pb-16 md:pt-16 md:pb-24">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-2 lg:items-center">
          <div>
            <h1 className="mb-5 font-serif text-4xl leading-[1.1] md:text-5xl">
              Vous comprenez l'anglais mais vous <span className="italic">bloquez</span> quand vous devez parler ?
            </h1>
            <p className="mb-7 text-lg text-sage-900/70">
              Testez gratuitement une séance individuelle de 20 minutes avec un professeur. Il évalue votre niveau et vous donne un plan concret pour parler avec aisance.
            </p>
            <Cta location="hero" />
            <p className="mt-3 text-sm font-medium text-sage-900/70">20 minutes · 100 % gratuit · Sans carte bancaire</p>
          </div>
          <img src={heroImg} alt="Apprenante en cours d'anglais en ligne" width={1024} height={768} fetchPriority="high" className="hidden aspect-[4/3] w-full rounded-2xl object-cover shadow-soft lg:block" />
        </div>
      </header>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="mb-8 text-center font-serif text-3xl">Ça vous parle ?</h2>
          <ul className="space-y-3">
            {pains.map((p) => (
              <li key={p} className="flex gap-3 rounded-xl bg-cream-100 px-5 py-4"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-sage-600" /> {p}</li>
            ))}
          </ul>
          <p className="mt-8 text-center text-sage-900/70">Ce n'est pas un problème de niveau, c'est un manque de pratique. En cours individuel, vous parlez pendant toute la séance.</p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto grid max-w-5xl gap-6 px-6 md:grid-cols-3">
          {[
            { icon: UserCheck, t: "100 % individuel", d: "Un professeur pour vous seul, à votre rythme." },
            { icon: CalendarCheck, t: "Selon vos horaires", d: "Créneaux en ligne de 8h à 22h." },
            { icon: ShieldCheck, t: "Sans engagement", d: "Séance d'essai gratuite, sans carte bancaire." },
          ].map((b) => (
            <div key={b.t} className="rounded-2xl bg-white p-6 ring-1 ring-sage-100">
              <b.icon className="mb-3 h-6 w-6 text-sage-600" />
              <h3 className="mb-1 font-serif text-xl">{b.t}</h3>
              <p className="text-sm text-muted-foreground">{b.d}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center"><Cta location="benefits" /></div>
      </section>

      <TrustBand />

      <div className="mx-auto max-w-3xl px-6 py-20"><FaqSection /></div>

      <section className="pb-24">
        <div className="mx-auto max-w-4xl px-6">
          <div className="rounded-3xl bg-sage-900 p-10 text-center text-primary-foreground md:p-14">
            <h2 className="mb-6 font-serif text-3xl">Votre première séance est offerte</h2>
            <Link to="/essai-gratuit" onClick={() => track("cta_click", { location: "final", page: "anglais-conversation" })} className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 font-medium text-sage-900">
              <Gift className="h-4 w-4" /> Je réserve ma séance gratuite
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-sage-100 py-8 text-center text-xs text-muted-foreground">
        PolyLinguist · <a href="mailto:contact@polylinguist.fr" className="hover:underline">contact@polylinguist.fr</a> · +33 6 28 54 02 70
      </footer>
    </div>
  );
}
