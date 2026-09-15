import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { Search } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CourseCard } from "@/components/site/CourseCard";
import { coursesQuery, levelLabels, formatLabels, type Course } from "@/lib/courses";

const searchSchema = z.object({
  langue: fallback(z.string().optional(), undefined),
  niveau: fallback(z.enum(["debutant", "intermediaire", "avance"]).optional(), undefined),
  format: fallback(z.literal("live").optional(), undefined),
  q: fallback(z.string().optional(), undefined),
});

export const Route = createFileRoute("/catalogue")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Catalogue de cours — Linguist" },
      { name: "description", content: "Parcourez tous nos cours d'anglais en direct : sessions à réserver, filtrables par langue et niveau." },
      { property: "og:title", content: "Catalogue de cours — Linguist" },
      { property: "og:description", content: "Parcourez tous nos cours en direct, filtrables par langue et niveau." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(coursesQuery()),
  errorComponent: ({ error }) => <div className="p-8">{error.message}</div>,
  notFoundComponent: () => <div className="p-8">Introuvable</div>,
  component: Catalogue,
});

function Catalogue() {
  const { data: courses } = useSuspenseQuery(coursesQuery());
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [q, setQ] = useState(search.q ?? "");

  const languages = useMemo(() => Array.from(new Set(courses.map((c) => c.language))).sort(), [courses]);

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      if (search.langue && c.language !== search.langue) return false;
      if (search.niveau && c.level !== search.niveau) return false;
      if (search.format && c.format !== search.format) return false;
      if (q && !c.title.toLowerCase().includes(q.toLowerCase()) && !c.language.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [courses, search, q]);

  function setFilter<K extends keyof typeof search>(key: K, value: (typeof search)[K]) {
    navigate({ search: (prev: typeof search) => ({ ...prev, [key]: prev[key] === value ? undefined : value }) });
  }

  return (
    <div className="min-h-screen bg-cream-100 text-sage-900">
      <Header />

      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-12">
          <h1 className="font-serif text-4xl md:text-5xl mb-3">Catalogue</h1>
          <p className="text-muted-foreground max-w-2xl">
            {filtered.length} cours {filtered.length > 1 ? "disponibles" : "disponible"}. Trouvez celui qui vous correspond.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          {/* Filters */}
          <aside className="space-y-8">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Recherche</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Anglais, business..."
                  className="w-full rounded-lg border border-sage-100 bg-white pl-9 pr-3 py-2 text-sm focus:border-sage-600 focus:outline-none"
                />
              </div>
            </div>

            <FilterGroup label="Langue">
              {languages.map((l) => (
                <FilterChip key={l} active={search.langue === l} onClick={() => setFilter("langue", l)}>{l}</FilterChip>
              ))}
            </FilterGroup>

            <FilterGroup label="Niveau">
              {(["debutant", "intermediaire", "avance"] as const).map((lv) => (
                <FilterChip key={lv} active={search.niveau === lv} onClick={() => setFilter("niveau", lv)}>{levelLabels[lv]}</FilterChip>
              ))}
            </FilterGroup>

            <FilterGroup label="Format">
              {(["live"] as const).map((f) => (
                <FilterChip key={f} active={search.format === f} onClick={() => setFilter("format", f)}>{formatLabels[f]}</FilterChip>
              ))}
            </FilterGroup>

            {(search.langue || search.niveau || search.format || q) && (
              <button
                onClick={() => { setQ(""); navigate({ search: {} }); }}
                className="text-xs font-semibold text-sage-600 hover:underline"
              >
                Réinitialiser les filtres
              </button>
            )}
          </aside>

          {/* Grid */}
          <div>
            {filtered.length === 0 ? (
              <div className="rounded-2xl bg-white p-12 text-center ring-1 ring-sage-100">
                <p className="text-muted-foreground">Aucun cours ne correspond à votre recherche.</p>
                <Link to="/catalogue" search={{}} className="mt-4 inline-block text-sm font-semibold text-sage-600 hover:underline">
                  Voir tous les cours
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((c) => <CourseCard key={c.id} course={c} />)}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">{label}</h3>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
        active ? "bg-sage-600 text-white" : "border border-sage-100 bg-white text-sage-600 hover:bg-sage-50"
      }`}
    >
      {children}
    </button>
  );
}
