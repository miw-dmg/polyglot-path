import { GraduationCap, Users, ThumbsUp } from "lucide-react";

const figures = [
  { icon: Users, value: "+500", label: "étudiants ont utilisé nos cours" },
  { icon: GraduationCap, value: "+50", label: "professeurs certifiés employés" },
  { icon: ThumbsUp, value: "98%", label: "de satisfaction client" },
];

export function TrustBand() {
  return (
    <section aria-label="Chiffres clés" className="border-y border-sage-100 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-10 text-center sm:grid-cols-3">
        {figures.map((f) => (
          <div key={f.value}>
            <f.icon className="mx-auto mb-2 h-5 w-5 text-sage-600" />
            <div className="font-serif text-4xl text-sage-600">{f.value}</div>
            <p className="mt-1 text-sm text-muted-foreground">{f.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
