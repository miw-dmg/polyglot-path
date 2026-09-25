import { Link } from "@tanstack/react-router";
import { type Course, courseImage, levelLabels, formatLabels } from "@/lib/courses";
import { formatPrice } from "@/lib/cart";
import coursAnglaisImg from "@/assets/cours-anglais.jpg";

export function CourseCard({ course }: { course: Course }) {
  const img = courseImage(course) ?? coursAnglaisImg;
  return (
    <Link
      to="/cours/$slug"
      params={{ slug: course.slug }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-sage-100 transition-all hover:shadow-soft hover:-translate-y-1"
    >
      <div className="aspect-video w-full bg-sage-50 overflow-hidden">
        <img src={img} alt={course.title} loading="lazy" width={1024} height={1024} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            {course.language} · {levelLabels[course.level]} · {formatLabels[course.format]}
          </span>
          <span className="text-lg font-serif font-bold text-sage-600">
            {formatPrice(course.price_cents)}{course.format === "abonnement" ? "/m" : ""}
          </span>
        </div>
        <span className="mb-2 self-start rounded-full bg-sage-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-sage-600">
          Cours individuel
        </span>
        <h3 className="mb-2 text-lg font-semibold leading-snug group-hover:text-sage-600 transition-colors">
          {course.title}
        </h3>
        <p className="mb-6 flex-1 text-sm text-muted-foreground line-clamp-2">{course.summary}</p>
        <span className="w-full text-center rounded-lg border border-sage-600 py-2.5 text-sm font-semibold text-sage-600 group-hover:bg-sage-600 group-hover:text-white transition-all">
          Voir le cours
        </span>
      </div>
    </Link>
  );
}
