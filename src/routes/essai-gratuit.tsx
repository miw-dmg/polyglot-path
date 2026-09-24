import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, useQuery, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { CheckCircle2, Video } from "lucide-react";
import { BookingCalendar } from "@/components/site/BookingCalendar";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { coursesQuery, courseImage } from "@/lib/courses";
import { courseSessionsQuery, formatSessionDate } from "@/lib/sessions";
import { bookTrialSession } from "@/lib/trial.functions";
import coursAnglaisImg from "@/assets/cours-anglais.jpg";

export const Route = createFileRoute("/essai-gratuit")({
  head: () => ({
    meta: [
      { title: "Séance d'essai gratuite — Linguist" },
      { name: "description", content: "Réservez une séance d'essai gratuite en direct avec un professeur certifié : conversation, anglais des affaires ou parcours certifiant. Sans engagement." },
      { property: "og:title", content: "Séance d'essai gratuite — Linguist" },
      { property: "og:description", content: "Testez gratuitement une séance en direct avec un professeur certifié. Sans carte bancaire, sans engagement." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(coursesQuery()),
  component: TrialPage,
});

function TrialPage() {
  const { data: courses } = useSuspenseQuery(coursesQuery());
  const [courseId, setCourseId] = useState<string>(courses[0]?.id ?? "");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const selectedCourse = courses.find((c) => c.id === courseId) ?? courses[0];
  const { data: sessions = [], isLoading } = useQuery({
    ...courseSessionsQuery(courseId),
    enabled: !!courseId,
  });

  const book = useServerFn(bookTrialSession);
  const mutation = useMutation({
    mutationFn: () => book({ data: { name, email, courseId, sessionId: sessionId! } }),
  });

  if (mutation.data) {
    const r = mutation.data;
    return (
      <div className="min-h-screen bg-cream-100 text-sage-900">
        <Header />
        <main className="mx-auto max-w-2xl px-6 py-24">
          <div className="rounded-3xl bg-white p-10 text-center ring-1 ring-sage-100">
            <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-sage-600" />
            <h1 className="mb-3 font-serif text-3xl">Votre séance d'essai est réservée</h1>
            <p className="mb-6 text-sage-900/70">
              {r.courseTitle} — {formatSessionDate(r.startsAt)}. Un email de confirmation est envoyé à {email}.
            </p>
            {r.meetingUrl && (
              <a href={r.meetingUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-sage-600 px-6 py-3 font-medium text-white">
                <Video className="h-4 w-4" /> Lien de la visioconférence
              </a>
            )}
            <div className="mt-8">
              <Link to="/catalogue" className="text-sm font-semibold text-sage-600 hover:underline">
                Découvrir le catalogue →
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const canSubmit = !!courseId && !!sessionId && name.trim() && /.+@.+\..+/.test(email);

  return (
    <div className="min-h-screen bg-cream-100 text-sage-900">
      <Header />
      <main className="mx-auto max-w-5xl px-6 py-16">
        <span className="mb-4 inline-block rounded-full bg-sage-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sage-600">
          Sans engagement
        </span>
        <h1 className="mb-4 font-serif text-4xl md:text-5xl">Votre première séance est gratuite</h1>
        <p className="mb-12 max-w-2xl text-lg text-sage-900/70">
          Choisissez votre catégorie, réservez un créneau en direct avec un professeur certifié, et testez la méthode. Aucune carte bancaire, aucun compte à créer.
        </p>

        <section className="mb-12">
          <h2 className="mb-4 font-serif text-2xl">1. Choisissez votre catégorie</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {courses.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => { setCourseId(c.id); setSessionId(null); }}
                className={`overflow-hidden rounded-2xl bg-white text-left ring-1 transition-all ${
                  c.id === courseId ? "ring-2 ring-sage-600" : "ring-sage-100 hover:ring-sage-600/50"
                }`}
              >
                <img src={courseImage(c) ?? coursAnglaisImg} alt={c.title} loading="lazy" width={1024} height={1024} className="aspect-video w-full object-cover" />
                <div className="p-4">
                  <h3 className="font-semibold leading-snug">{c.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">Séance d'essai offerte</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 font-serif text-2xl">2. Choisissez votre créneau</h2>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Chargement des créneaux…</p>
          ) : sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun créneau disponible pour le moment.</p>
          ) : (
            <BookingCalendar
              key={courseId}
              slots={sessions}
              selectedId={sessionId}
              onSelect={(s) => setSessionId(s?.id ?? null)}
            />
          )}
        </section>

        <section className="rounded-3xl bg-white p-8 ring-1 ring-sage-100">
          <h2 className="mb-4 font-serif text-2xl">3. Vos coordonnées</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm">
              <span className="mb-1 block font-medium">Nom complet</span>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-sage-100 px-4 py-3" placeholder="Camille Durand" />
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-medium">Email</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-sage-100 px-4 py-3" placeholder="camille@exemple.fr" />
            </label>
          </div>
          {sessionId && (
            <p className="mt-4 rounded-lg bg-sage-50 px-4 py-3 text-sm font-medium text-sage-700">
              Créneau choisi : {formatSessionDate(sessions.find((s) => s.id === sessionId)?.starts_at ?? "")}
            </p>
          )}
          {mutation.error && <p className="mt-4 text-sm text-red-600">{(mutation.error as Error).message}</p>}
          <button
            type="button"
            disabled={!canSubmit || mutation.isPending}
            onClick={() => mutation.mutate()}
            className="mt-6 w-full rounded-lg bg-sage-600 px-8 py-4 font-medium text-white transition-all hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-50 sm:w-auto"
          >
            {mutation.isPending ? "Réservation…" : "Réserver ma séance gratuite"}
          </button>
          <p className="mt-3 text-xs text-muted-foreground">
            {selectedCourse ? `${selectedCourse.title} · ` : ""}Gratuit, sans engagement.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
