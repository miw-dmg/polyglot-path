import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: "À propos — Linguist" },
      { name: "description", content: "Linguist est une plateforme dédiée à l'apprentissage des langues avec passion et rigueur." },
      { property: "og:title", content: "À propos — Linguist" },
      { property: "og:description", content: "Notre mission : rendre l'apprentissage des langues accessible, vivant et durable." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="min-h-screen bg-cream-100 text-sage-900">
      <Header />
      <div className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="font-serif text-5xl mb-6">À propos de Linguist</h1>
        <p className="text-lg text-sage-900/80 leading-relaxed mb-6">
          Linguist est née d'une conviction simple : apprendre une langue ne devrait jamais être ennuyeux. C'est une rencontre — avec une culture, une manière de penser, des gens.
        </p>
        <p className="text-sage-900/80 leading-relaxed mb-6">
          Nos cours sont conçus par des linguistes passionnés et des locuteurs natifs certifiés. Toutes nos formations se déroulent en sessions live en petit groupe, à réserver selon vos disponibilités, avec un accompagnement personnalisé pour vous faire progresser durablement.
        </p>

        <div className="grid gap-6 sm:grid-cols-3 my-12">
          {[
            { n: "1 000+", l: "Apprenants" },
            { n: "6", l: "Langues" },
            { n: "4.8/5", l: "Note moyenne" },
          ].map((s) => (
            <div key={s.l} className="rounded-2xl bg-white p-6 text-center ring-1 ring-sage-100">
              <div className="font-serif text-3xl font-bold text-sage-600">{s.n}</div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{s.l}</div>
            </div>
          ))}
        </div>

        <h2 className="font-serif text-3xl mt-12 mb-4">Notre méthode</h2>
        <p className="text-sage-900/80 leading-relaxed mb-6">
          Chaque cours suit une progression structurée, avec des objectifs clairs à chaque étape. Nous croyons en la pratique active : écouter, parler, écrire et comprendre — toujours en contexte.
        </p>

        <div className="mt-12">
          <Link to="/catalogue" className="inline-block rounded-lg bg-sage-600 px-6 py-3 font-semibold text-white hover:bg-sage-900 transition-colors">
            Découvrir les cours
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
