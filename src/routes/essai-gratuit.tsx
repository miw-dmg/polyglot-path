import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, useQuery, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { BookingCalendar } from "@/components/site/BookingCalendar";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { coursesQuery, courseImage } from "@/lib/courses";
import { courseSessionsQuery, formatSessionDate } from "@/lib/sessions";
import { bookTrialSession } from "@/lib/trial.functions";
import { captureLead, markLeadBooked, LEAD_GOALS } from "@/lib/leads.functions";
import { track } from "@/lib/track";
import coursAnglaisImg from "@/assets/cours-anglais.jpg";

export const Route = createFileRoute("/essai-gratuit")({
  head: () => ({
    meta: [
      { title: "Séance d'essai gratuite — PolyLinguist" },
      { name: "description", content: "Réservez une séance d'essai gratuite en direct avec un professeur certifié : conversation, anglais des affaires ou parcours certifiant. Sans engagement." },
      { property: "og:title", content: "Séance d'essai gratuite — PolyLinguist" },
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
  const [phone, setPhone] = useState("");
  const [goal, setGoal] = useState<(typeof LEAD_GOALS)[number] | null>(null);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const saveLead = useServerFn(captureLead);
  const markBooked = useServerFn(markLeadBooked);
  const leadMutation = useMutation({
    mutationFn: () => saveLead({ data: { firstName: name, email, phone, goal: goal!, source: typeof window !== "undefined" ? window.location.search.slice(0, 200) : undefined } }),
    onSuccess: (r) => {
      setLeadId(r.leadId);
      track("lead_form_submit", { goal });
      track("booking_start");
      if (goal === "Préparer un examen") {
        const t = courses.find((c) => c.slug === "anglais-toefl");
        if (t) setCourseId(t.id);
      } else if (goal === "Anglais professionnel") {
        const b = courses.find((c) => c.slug === "anglais-affaires");
        if (b) setCourseId(b.id);
      }
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
    },
  });

  const selectedCourse = courses.find((c) => c.id === courseId) ?? courses[0];
  const { data: sessions = [], isLoading } = useQuery({
    ...courseSessionsQuery(courseId),
    enabled: !!courseId,
  });

  const book = useServerFn(bookTrialSession);
  const mutation = useMutation({
    mutationFn: () => book({ data: { name, email, courseId, sessionId: sessionId! } }),
    onSuccess: () => {
      track("booking_complete");
      if (leadId) markBooked({ data: { leadId } }).catch(() => {});
    },
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
  const canLead = name.trim() && /.+@.+\..+/.test(email) && !!goal;
  const onField = () => { if (!started) { setStarted(true); track("lead_form_start"); } };
  const input = "w-full rounded-lg border border-sage-100 bg-white px-4 py-3 text-base";

  return (
    <div className="min-h-screen bg-cream-100 text-sage-900">
      <Header />
      <main className="mx-auto max-w-5xl px-6 py-12 md:py-16">
        <div className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-wider">
          <span className={leadId ? "text-muted-foreground" : "text-sage-600"}>Étape 1 · Votre objectif</span>
          <span className="h-px w-8 bg-sage-100" />
          <span className={leadId ? "text-sage-600" : "text-muted-foreground"}>Étape 2 · Votre créneau</span>
        </div>

        {!leadId ? (
          <>
            <h1 className="mb-3 font-serif text-4xl md:text-5xl">Testez votre anglais gratuitement</h1>
            <p className="mb-8 max-w-2xl text-lg text-sage-900/70">
              20 minutes avec un professeur pour évaluer votre niveau et repartir avec des conseils personnalisés. 100 % gratuit, sans carte bancaire.
            </p>
            <form
              onSubmit={(e) => { e.preventDefault(); if (canLead) leadMutation.mutate(); }}
              className="max-w-2xl rounded-3xl bg-white p-6 ring-1 ring-sage-100 md:p-8"
            >
              <h2 className="mb-5 font-serif text-2xl">Parlez-nous de votre objectif</h2>
              <fieldset className="mb-6">
                <legend className="mb-3 text-sm font-medium">Votre objectif</legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  {LEAD_GOALS.map((g) => (
                    <button
                      key={g}
                      type="button"
                      aria-pressed={goal === g}
                      onClick={() => { onField(); setGoal(g); }}
                      className={`rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors ${goal === g ? "bg-sage-600 text-white" : "bg-cream-100 ring-1 ring-sage-100 hover:bg-sage-50"}`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </fieldset>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm">
                  <span className="mb-1 block font-medium">Prénom</span>
                  <input required autoComplete="given-name" value={name} onFocus={onField} onChange={(e) => setName(e.target.value)} className={input} placeholder="Camille" />
                </label>
                <label className="text-sm">
                  <span className="mb-1 block font-medium">Email</span>
                  <input required type="email" autoComplete="email" inputMode="email" value={email} onFocus={onField} onChange={(e) => setEmail(e.target.value)} className={input} placeholder="camille@exemple.fr" />
                </label>
                <label className="text-sm sm:col-span-2">
                  <span className="mb-1 block font-medium">Téléphone <span className="font-normal text-muted-foreground">(facultatif)</span></span>
                  <input type="tel" autoComplete="tel" inputMode="tel" value={phone} onFocus={onField} onChange={(e) => setPhone(e.target.value)} className={input} placeholder="06 12 34 56 78" />
                </label>
              </div>
              {leadMutation.error && <p className="mt-4 text-sm text-destructive">{(leadMutation.error as Error).message}</p>}
              <button
                type="submit"
                disabled={!canLead || leadMutation.isPending}
                className="mt-6 w-full rounded-lg bg-sage-600 px-8 py-4 font-medium text-white transition-all hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-50"
              >
                {leadMutation.isPending ? "Envoi…" : "Continuer"}
              </button>
              <p className="mt-3 text-center text-xs text-muted-foreground">20 minutes · 100 % gratuit · Sans carte bancaire · Sans engagement</p>
            </form>
          </>
        ) : (
          <>
            <h1 className="mb-3 font-serif text-3xl md:text-4xl">Merci {name}, choisissez votre créneau</h1>
            <p className="mb-10 max-w-2xl text-sage-900/70">Sélectionnez le thème de votre séance puis l'horaire qui vous convient.</p>

            <section className="mb-12">
              <h2 className="mb-4 font-serif text-2xl">Thème de la séance</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {courses.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    aria-pressed={c.id === courseId}
                    onClick={() => { setCourseId(c.id); setSessionId(null); setTimeout(() => document.getElementById("trial-slots")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50); }}
                    className={`relative cursor-pointer overflow-hidden rounded-2xl text-left transition-all ${
                      c.id === courseId ? "bg-sage-50 ring-4 ring-sage-600" : "bg-white ring-1 ring-sage-100 hover:ring-2 hover:ring-sage-600/50"
                    }`}
                  >
                    <img src={courseImage(c) ?? coursAnglaisImg} alt={c.title} loading="lazy" width={1024} height={1024} className="aspect-video w-full object-cover" />
                    {c.id === courseId && (<span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-sage-600 px-2.5 py-1 text-xs font-semibold text-white"><CheckCircle2 className="h-3.5 w-3.5" /> Choisi</span>)}
                    <div className="p-4">
                      <h3 className="font-semibold leading-snug">{c.title}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">Séance d'essai offerte</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section id="trial-slots" className="mb-8 scroll-mt-24">
              <h2 className="mb-4 font-serif text-2xl">Votre créneau{selectedCourse ? ` — ${selectedCourse.title}` : ""}</h2>
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Chargement des créneaux…</p>
              ) : sessions.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucun créneau disponible pour le moment.</p>
              ) : (
                <BookingCalendar key={courseId} slots={sessions} selectedId={sessionId} onSelect={(s) => setSessionId(s?.id ?? null)} />
              )}
            </section>

            <section className="rounded-3xl bg-white p-6 ring-1 ring-sage-100 md:p-8">
              {sessionId ? (
                <p className="mb-4 rounded-lg bg-sage-50 px-4 py-3 text-sm font-medium text-sage-700">
                  Créneau choisi : {formatSessionDate(sessions.find((s) => s.id === sessionId)?.starts_at ?? "")}
                </p>
              ) : (
                <p className="mb-4 text-sm text-muted-foreground">Choisissez un créneau ci-dessus pour confirmer.</p>
              )}
              {mutation.error && <p className="mb-4 text-sm text-destructive">{(mutation.error as Error).message}</p>}
              <button
                type="button"
                disabled={!canSubmit || mutation.isPending}
                onClick={() => mutation.mutate()}
                className="w-full rounded-lg bg-sage-600 px-8 py-4 font-medium text-white transition-all hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-50 sm:w-auto"
              >
                {mutation.isPending ? "Réservation…" : "Je réserve ma séance gratuite"}
              </button>
              <p className="mt-3 text-xs text-muted-foreground">Confirmation envoyée à {email}. Gratuit, sans engagement.</p>
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
