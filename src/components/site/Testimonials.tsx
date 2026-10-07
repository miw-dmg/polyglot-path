import { Star } from "lucide-react";

type Testimonial = {
  firstName: string;
  profile?: string;
  photo?: string;
  result: string;
  rating: number;
};

// Only real, verified client testimonials. The section stays hidden while empty.
const testimonials: Testimonial[] = [];

export function Testimonials() {
  if (testimonials.length === 0) return null;
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="mb-12 text-center font-serif text-3xl md:text-4xl">Ils progressent avec PolyLinguist</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.firstName + t.result} className="rounded-2xl bg-white p-6 ring-1 ring-sage-100">
              <div className="mb-3 flex gap-0.5 text-sage-600" aria-label={`Note ${t.rating} sur 5`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < t.rating ? "fill-current" : "opacity-30"}`} />
                ))}
              </div>
              <blockquote className="mb-5 text-sage-900/80 leading-relaxed">{t.result}</blockquote>
              <figcaption className="flex items-center gap-3">
                {t.photo && <img src={t.photo} alt={t.firstName} loading="lazy" className="h-10 w-10 rounded-full object-cover" />}
                <div>
                  <div className="font-semibold">{t.firstName}</div>
                  {t.profile && <div className="text-xs text-muted-foreground">{t.profile}</div>}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
