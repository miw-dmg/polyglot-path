import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, Mail, CalendarPlus, Video } from "lucide-react";

const faqs = [
  { q: "Que se passe-t-il en cas d'imprévu ?", a: "Vous pouvez reporter votre créneau sans frais jusqu'à 24h avant la séance, par simple email ou via le lien reçu." },
  { q: "Comment s'applique la garantie Satisfait ou remboursé ?", a: "Si votre premier cours individuel ne répond pas entièrement à vos attentes, nous vous remboursons intégralement sur simple demande sous 48h." },
  { q: "Quel matériel ou logiciel est nécessaire ?", a: "Aucun logiciel à installer. Un simple navigateur web sur ordinateur, tablette ou smartphone avec webcam et micro suffit." },
  { q: "Qui sont les professeurs PolyLinguist ?", a: "Des enseignants bilingues ou natifs rigoureusement certifiés (CELTA, TEFL ou diplômes équivalents) cumulant une expertise concrète du monde des affaires." },
];

export function FaqSection({ className = "" }: { className?: string }) {
  return (
    <section className={className}>
      <h2 className="font-serif text-3xl mb-6 text-center">Questions fréquentes</h2>
      <Accordion type="single" collapsible className="rounded-2xl bg-white px-6 ring-1 ring-sage-100">
        {faqs.map((f, i) => (
          <AccordionItem key={f.q} value={`f${i}`} className="border-sage-100">
            <AccordionTrigger className="text-left font-semibold">{f.q}</AccordionTrigger>
            <AccordionContent className="text-sage-900/75 leading-relaxed">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

const after = [
  { icon: Mail, text: "Confirmation immédiate par email avec votre facture et le récapitulatif du créneau." },
  { icon: CalendarPlus, text: "Fichier d'invitation calendrier (Google Calendar / Outlook) pour bloquer automatiquement votre créneau." },
  { icon: Video, text: "Lien de connexion direct envoyé par email 15 minutes avant le début de votre séance." },
];

export function AfterOrder() {
  return (
    <div className="rounded-2xl bg-white p-6 ring-1 ring-sage-100">
      <h3 className="font-serif text-xl mb-4">Déroulement après votre commande</h3>
      <ol className="space-y-4">
        {after.map((s, i) => (
          <li key={i} className="flex gap-3">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sage-100 text-sage-600"><s.icon className="h-4 w-4" /></span>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Étape {i + 1}</div>
              <p className="text-sm text-sage-900/80">{s.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

const packItems = [
  "Bilan initial de compétences et définition de vos objectifs professionnels lors du 1er créneau.",
  "10 séances individuelles de 60 minutes en visioconférence directe.",
  "Synthèse de vocabulaire, tournures clés et corrections partagées après chaque séance.",
  "Compte-rendu de progression et plan d'action personnalisé à la fin du parcours.",
];

export function PackIncluded() {
  return (
    <section className="mb-10">
      <h2 className="font-serif text-2xl mb-4">Ce qui est inclus dans le pack 10H</h2>
      <ul className="space-y-3">
        {packItems.map((t) => (
          <li key={t} className="flex items-start gap-2 text-sage-900/80"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sage-600" /> {t}</li>
        ))}
      </ul>
    </section>
  );
}
