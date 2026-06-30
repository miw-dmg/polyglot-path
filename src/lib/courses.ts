import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import courseItalianImg from "@/assets/course-italian.jpg";
import courseJapaneseImg from "@/assets/course-japanese.jpg";
import courseSpanishImg from "@/assets/course-spanish.jpg";

export type Course = {
  id: string;
  slug: string;
  title: string;
  language: string;
  language_flag: string | null;
  level: "debutant" | "intermediaire" | "avance";
  format: "video" | "live" | "abonnement";
  price_cents: number;
  description: string | null;
  summary: string | null;
  prerequisites: string | null;
  curriculum: Array<{ title: string; duration: string }>;
  image_url: string | null;
  rating: number;
  reviews_count: number;
  duration_hours: number | null;
  is_featured: boolean;
};

const imageMap: Record<string, string> = {
  "/src/assets/course-italian.jpg": courseItalianImg,
  "/src/assets/course-japanese.jpg": courseJapaneseImg,
  "/src/assets/course-spanish.jpg": courseSpanishImg,
};

export function resolveImage(url: string | null, language: string): string | null {
  if (!url) {
    // language fallback
    if (language === "Italien") return courseItalianImg;
    if (language === "Japonais") return courseJapaneseImg;
    if (language === "Espagnol") return courseSpanishImg;
    return null;
  }
  return imageMap[url] ?? url;
}

export const levelLabels: Record<Course["level"], string> = {
  debutant: "Débutant",
  intermediaire: "Intermédiaire",
  avance: "Avancé",
};
export const formatLabels: Record<Course["format"], string> = {
  video: "Vidéo",
  live: "Live",
  abonnement: "Abonnement",
};

export const coursesQuery = () =>
  queryOptions({
    queryKey: ["courses"],
    queryFn: async (): Promise<Course[]> => {
      const { data, error } = await supabase.from("courses").select("*").order("is_featured", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Course[];
    },
  });

export const courseBySlugQuery = (slug: string) =>
  queryOptions({
    queryKey: ["course", slug],
    queryFn: async (): Promise<Course | null> => {
      const { data, error } = await supabase.from("courses").select("*").eq("slug", slug).maybeSingle();
      if (error) throw error;
      return (data as unknown as Course) ?? null;
    },
  });
