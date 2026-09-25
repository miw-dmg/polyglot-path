import { useEffect, useRef, useState } from "react";
import { GraduationCap, Users, ThumbsUp } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";

const figures = [
  { icon: Users, value: "+1 000", label: "étudiants ont utilisé nos cours" },
  { icon: GraduationCap, value: "+50", label: "professeurs certifiés employés" },
  { icon: ThumbsUp, value: "98%", label: "de satisfaction client" },
];

/** Compteur animé : le chiffre grimpe de 0 à sa valeur quand il entre à l'écran. */
function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const match = value.match(/^([^\d]*)([\d\s\u00a0]+)(.*)$/);
    if (!match) return;
    const prefix = match[1];
    const suffix = match[3];
    const target = parseInt(match[2].replace(/[\s\u00a0]/g, ""), 10);
    if (!Number.isFinite(target) || target === 0) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const duration = 1400;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          setDisplay(`${prefix}${Math.round(target * eased).toLocaleString("fr-FR")}${suffix}`);
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="font-serif text-4xl text-sage-600">
      {display}
    </div>
  );
}

export function TrustBand() {
  return (
    <section aria-label="Chiffres clés" className="border-y border-sage-100 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-10 text-center sm:grid-cols-3">
        {figures.map((f, i) => (
          <Reveal key={f.label} delay={i * 120}>
            <div>
              <f.icon className="mx-auto mb-2 h-5 w-5 text-sage-600" />
              <CountUp value={f.value} />
              <p className="mt-1 text-sm text-muted-foreground">{f.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
