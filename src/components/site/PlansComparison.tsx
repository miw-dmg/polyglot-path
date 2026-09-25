import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, Minus } from "lucide-react";

type Plan = { slug: string; name: string; sub: string; price: string; perHour: string; goal: string; cta: string; featured?: boolean };

const plans: Plan[] = [
  { slug: "cours-a-la-demande", name: "Cours à la demande", sub: "1H", price: "50 €", perHour: "50 € / heure", goal: "Besoin ponctuel, préparation d'une réunion ou d'un entretien urgent.", cta: "Réserver une heure" },
  { slug: "anglais-conversationnel", name: "Anglais Conversationnel", sub: "Pack 10H", price: "299 €", perHour: "soit 29,90 € / heure", goal: "Débloquer la fluidité et gagner en confiance au quotidien.", cta: "Choisir cette formule" },
  { slug: "anglais-affaires", name: "Business English", sub: "Pack 10H", price: "349 €", perHour: "soit 34,90 € / heure", goal: "Négociation, réunions internationales, pitchs et vocabulaire sectoriel.", cta: "Choisir cette formule", featured: true },
  { slug: "anglais-toefl", name: "Parcours Certifiant TOEFL / IELTS", sub: "Pack 10H", price: "449 €", perHour: "soit 44,90 € / heure", goal: "Réussir les tests officiels avec entraînements ciblés et examens blancs.", cta: "Choisir cette formule" },
];

type Cell = string | boolean;
const rows: { label: string; cells: Cell[] }[] = [
  { label: "Format du cours", cells: Array(4).fill("Individuel, 1 élève, 1 professeur certifié") },
  { label: "Durée totale", cells: ["1 heure", "10 heures", "10 heures", "10 heures"] },
  { label: "Économie horaire", cells: ["Tarif unitaire", "-40 %", "-30 %", "Tarif parcours certifiant"] },
  { label: "Bilan de niveau & diagnostic initial", cells: [false, true, true, true] },
  { label: "Synthèse de vocabulaire après chaque session", cells: ["Synthèse basique", "Fiche sur-mesure", "Fiche sur-mesure", "Fiche sur-mesure"] },
  { label: "Supports métier personnalisés", cells: [false, false, "Adaptés à votre secteur", "Adaptés à votre secteur"] },
  { label: "Examens blancs et entraînements types", cells: [false, false, false, "2 tests blancs complets"] },
  { label: "Flexibilité de réservation", cells: Array(4).fill("30 jours, 8h-22h, 7j/7, report sans frais jusqu'à 24h avant") },
  { label: "Bilan de progression final", cells: [false, "Plan d'action personnalisé", "Plan d'action personnalisé", "Plan d'action personnalisé"] },
];

function Value({ v }: { v: Cell }) {
  if (v === true) return <Check className="mx-auto h-4 w-4 text-sage-600" aria-label="Oui" />;
  if (v === false) return <Minus className="mx-auto h-4 w-4 text-muted-foreground/60" aria-label="Non" />;
  return <span>{v}</span>;
}

export function PlansComparison() {
  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-8">
          <h2 className="font-serif text-2xl md:text-3xl mb-2">Comparez nos formules</h2>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">Des cours individuels en direct adaptés à vos disponibilités et à vos objectifs professionnels.</p>
        </div>

        <p className="mb-3 text-center text-xs text-muted-foreground md:hidden">Faites glisser le tableau horizontalement →</p>
        <div className="overflow-x-auto rounded-2xl ring-1 ring-sage-100">
          <table className="w-full min-w-[720px] border-collapse text-[13px]">
            <thead>
              <tr>
                <th className="w-[19%] bg-cream-100 p-3 text-left align-bottom text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Formules</th>
                {plans.map((p) => (
                  <th key={p.slug} className={`p-3 text-left align-top font-normal ${p.featured ? "bg-sage-50" : "bg-cream-100"}`}>

                    <div className="font-serif text-sm leading-tight">{p.name}</div>
                    <div className="text-[11px] text-muted-foreground">{p.sub}</div>
                    <div className="mt-1.5 text-lg font-semibold">{p.price}</div>
                    <div className="text-[11px] text-muted-foreground">{p.perHour}</div>
                    <p className="mt-1.5 text-[11px] leading-snug text-sage-900/70">{p.goal}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label} className="border-t border-sage-100">
                  <th className="p-2.5 text-left font-medium">{r.label}</th>
                  {r.cells.map((c, i) => (
                    <td key={i} className={`p-2.5 text-center text-[12px] text-sage-900/80 ${plans[i].featured ? "bg-sage-50/60" : ""}`}><Value v={c} /></td>
                  ))}
                </tr>
              ))}
              <tr className="border-t border-sage-100">
                <td className="p-2.5" />
                {plans.map((p) => (
                  <td key={p.slug} className={`p-2.5 ${p.featured ? "bg-sage-50/60" : ""}`}>
                    <Link to="/cours/$slug" params={{ slug: p.slug }} className={`flex items-center justify-center gap-1 rounded-md px-2 py-2 text-[11px] font-semibold transition-all hover:-translate-y-0.5 ${p.featured ? "bg-sage-600 text-white" : "border border-sage-100 bg-white text-sage-900 hover:bg-sage-50"}`}>
                      {p.cta} <ArrowRight className="h-3 w-3" />
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-col items-center gap-3 rounded-xl bg-cream-100 p-5 text-center ring-1 ring-sage-100 md:flex-row md:justify-between md:text-left">
          <p className="text-sm text-sage-900/80"><span className="font-semibold">Vous hésitez encore ?</span> Réservez votre séance d'essai gratuite de 20 minutes pour évaluer votre niveau sans engagement.</p>
          <Link to="/essai-gratuit" className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-sage-900 px-5 py-2.5 text-sm font-medium text-white hover:-translate-y-0.5 transition-all">
            Séance d'essai gratuite <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
