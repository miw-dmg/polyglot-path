import { Play } from "lucide-react";

export type ClientVideo = {
  src: string;
  poster?: string;
  name: string;
  course: string;
};

// Ajoutez ici vos vidéos de retour clients :
// { src: "/videos/temoignage-clara.mp4", poster: "/videos/temoignage-clara.jpg", name: "Clara D.", course: "Anglais Conversationnel" }
// Les fichiers se placent dans le dossier public/ du projet (ex. public/videos/...).
export const clientVideos: ClientVideo[] = [
  { src: "", name: "Retour client", course: "Anglais Conversationnel" },
  { src: "", name: "Retour client", course: "Business English" },
  { src: "", name: "Retour client", course: "Parcours certifiant TOEFL" },
];

export function VideoTestimonials() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-14">
          <h2 className="font-serif text-3xl md:text-4xl mb-3">Ils témoignent en vidéo</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Découvrez ce que nos étudiants disent de leurs expériences PolyLinguist.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {clientVideos.map((v, i) => (
            <figure key={i} className="group overflow-hidden rounded-2xl bg-cream-100 ring-1 ring-sage-100">
              <div className="relative aspect-video bg-sage-900">
                {v.src ? (
                  <video
                    src={v.src}
                    poster={v.poster}
                    controls
                    playsInline
                    preload="metadata"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-white/70">
                    <span className="grid h-14 w-14 place-items-center rounded-full bg-white/10 ring-1 ring-white/20 transition-transform group-hover:scale-105">
                      <Play className="h-6 w-6 translate-x-0.5" />
                    </span>
                    <span className="text-xs uppercase tracking-widest">Vidéo à venir</span>
                  </div>
                )}
              </div>
              <figcaption className="p-5">
                <div className="font-semibold">{v.name}</div>
                <div className="text-xs text-muted-foreground">{v.course}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
