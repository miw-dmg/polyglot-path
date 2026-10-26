import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { openCookieSettings } from "@/lib/consent";

export const Route = createFileRoute("/confidentialite")({
  head: () => ({
    meta: [
      { title: "Confidentialité et cookies — PolyLinguist" },
      { name: "description", content: "Données collectées par PolyLinguist, pixel Meta et gestion de vos choix de cookies." },
      { property: "og:title", content: "Confidentialité et cookies — PolyLinguist" },
      { property: "og:description", content: "Données collectées par PolyLinguist, pixel Meta et gestion de vos choix de cookies." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="min-h-screen bg-cream-100 text-sage-900">
      <Header />
      <div className="mx-auto max-w-3xl px-6 py-16 space-y-6">
        <h1 className="font-serif text-4xl">Confidentialité et cookies</h1>
        <p>Lorsque vous demandez une séance d'essai, nous enregistrons votre prénom, votre e-mail, votre téléphone (facultatif) et votre objectif afin de vous recontacter et d'organiser la séance.</p>
        <h2 className="font-serif text-2xl">Pixel Meta</h2>
        <p>Avec votre accord, le site utilise le pixel de Meta Platforms Ireland (Facebook, Instagram). Il transmet à Meta les pages consultées, la demande de séance d'essai, des informations techniques sur votre navigateur (adresse IP, appareil) et des identifiants de cookies. Finalités : mesurer les résultats de nos publicités et améliorer leur diffusion. Sans accord, le pixel n'est pas chargé (visiteurs d'Europe).</p>
        <h2 className="font-serif text-2xl">Retirer votre accord</h2>
        <p>Vous pouvez modifier votre choix à tout moment ; il s'applique immédiatement.</p>
        <button onClick={openCookieSettings} className="rounded-lg bg-sage-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sage-900">Gérer mes cookies</button>
        <p>Pour toute question ou demande sur vos données : contact@polylinguist.fr.</p>
      </div>
      <Footer />
    </div>
  );
}
