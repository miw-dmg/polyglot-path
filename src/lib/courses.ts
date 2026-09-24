import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { fetchShopifyCatalog, type ShopifyCourseData } from "@/lib/shopify";
import courseItalianImg from "@/assets/course-italian.jpg";
import courseJapaneseImg from "@/assets/course-japanese.jpg";
import courseSpanishImg from "@/assets/course-spanish.jpg";
import coursAnglaisImg from "@/assets/cours-anglais.jpg";
import coursConversationImg from "@/assets/cours-conversation.jpg";
import coursAffairesImg from "@/assets/cours-affaires.jpg";

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

export function courseImage(course: { slug: string; image_url: string | null; language: string }): string | null {
  const resolved = resolveImage(course.image_url, course.language);
  if (resolved) return resolved;
  if (course.slug.includes("conversation")) return coursConversationImg;
  if (course.slug.includes("affaires")) return coursAffairesImg;
  if (course.language === "Anglais") return coursAnglaisImg;
  return null;
}

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
      const shop = await fetchShopifyCatalog().catch(() => null);
      const list = (data ?? []) as unknown as Course[];
      return shop ? list.filter((c) => shop[c.slug]).map((c) => mergeShop(c, shop[c.slug])) : list;
    },
  });

export const courseBySlugQuery = (slug: string) =>
  queryOptions({
    queryKey: ["course", slug],
    queryFn: async (): Promise<Course | null> => {
      const { data, error } = await supabase.from("courses").select("*").eq("slug", slug).maybeSingle();
      if (error) throw error;
      if (!data) return null;
      const shop = await fetchShopifyCatalog().catch(() => null);
      const c = data as unknown as Course;
      return shop?.[c.slug] ? mergeShop(c, shop[c.slug]) : c;
    },
  });

function mergeShop(c: Course, s: ShopifyCourseData): Course {
  return { ...c, title: s.title, price_cents: s.priceCents, description: s.description || c.description, summary: s.description || c.summary, image_url: s.imageUrl ?? c.image_url };
}
