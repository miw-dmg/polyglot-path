import sarah from "@/assets/prof-sarah.jpg";
import david from "@/assets/prof-david.jpg";
import emma from "@/assets/prof-emma.jpg";

const teachers = [
  { name: "Sarah M.", img: sarah, tag: "Accent britannique", text: "8 ans d'enseignement, spécialisée en négociation commerciale et communication de direction." },
  { name: "David K.", img: david, tag: "Accent américain", text: "Ancien cadre en finance d'entreprise, spécialiste de la préparation aux entretiens et prises de parole stratégiques." },
  { name: "Emma L.", img: emma, tag: "Certifiée CELTA", text: "Spécialisée dans la fluidité conversationnelle et la levée des blocages à l'oral." },
];

export function Teachers() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-14">
          <h2 className="font-serif text-3xl md:text-4xl mb-3">Nos professeurs</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Vos cours sont dispensés en tête-à-tête avec un professeur dédié à vos objectifs.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {teachers.map((t) => (
            <article key={t.name} className="overflow-hidden rounded-2xl bg-white ring-1 ring-sage-100">
              <img src={t.img} alt={`Portrait de ${t.name}`} loading="lazy" width={816} height={816} className="aspect-square w-full object-cover" />
              <div className="p-6">
                <div className="text-[10px] font-bold uppercase tracking-widest text-sage-600 mb-1">{t.tag}</div>
                <h3 className="font-serif text-xl mb-2">{t.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
