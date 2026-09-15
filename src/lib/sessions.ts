import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Session = Tables<"sessions">;

export type SessionWithAvailability = Session & {
  booked_count: number;
  spots_left: number;
  my_booking_id: string | null;
};

export function formatSessionDate(iso: string): string {
  const d = new Date(iso);
  const day = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Europe/Paris",
  }).format(d);
  const time = new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Paris",
  }).format(d);
  return `${day.charAt(0).toUpperCase()}${day.slice(1)} · ${time}`;
}

export function courseSessionsQuery(courseId: string) {
  return queryOptions({
    queryKey: ["sessions", courseId],
    queryFn: async (): Promise<SessionWithAvailability[]> => {
      const now = new Date().toISOString();
      const { data: sessions, error } = await supabase
        .from("sessions")
        .select("*")
        .eq("course_id", courseId)
        .gte("starts_at", now)
        .order("starts_at", { ascending: true });
      if (error) throw error;
      const rows = sessions ?? [];
      const ids = rows.map((s) => s.id);

      const counts: Record<string, number> = {};
      if (ids.length > 0) {
        const { data: c } = await supabase
          .from("session_booking_counts")
          .select("session_id, booked_count")
          .in("session_id", ids);
        for (const row of c ?? []) counts[row.session_id] = row.booked_count;
      }

      const myBookings: Record<string, string> = {};
      const { data: { user } } = await supabase.auth.getUser();
      if (user && ids.length > 0) {
        const { data: b } = await supabase
          .from("session_bookings")
          .select("id, session_id")
          .eq("user_id", user.id)
          .in("session_id", ids);
        for (const row of b ?? []) myBookings[row.session_id] = row.id;
      }

      return rows.map((s) => ({
        ...s,
        booked_count: counts[s.id] ?? 0,
        spots_left: Math.max(0, s.capacity - (counts[s.id] ?? 0)),
        my_booking_id: myBookings[s.id] ?? null,
      }));
    },
  });
}

export function enrollmentQuery(courseId: string) {
  return queryOptions({
    queryKey: ["enrollment", courseId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data, error } = await supabase
        .from("enrollments")
        .select("id, progress")
        .eq("user_id", user.id)
        .eq("course_id", courseId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export type MyBooking = {
  id: string;
  session_id: string;
  starts_at: string;
  duration_minutes: number;
  meeting_url: string | null;
  course_title: string;
  course_slug: string;
};

export function myBookingsQuery(enabled: boolean) {
  return queryOptions({
    queryKey: ["my-bookings"],
    enabled,
    queryFn: async (): Promise<MyBooking[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data, error } = await supabase
        .from("session_bookings")
        .select("id, session_id, sessions(starts_at, duration_minutes, meeting_url, courses(title, slug))")
        .eq("user_id", user.id);
      if (error) throw error;
      const now = Date.now();
      return (data ?? [])
        .flatMap((b) => {
          const s = b.sessions as { starts_at: string; duration_minutes: number; meeting_url: string | null; courses: { title: string; slug: string } | null } | null;
          if (!s || !s.courses) return [];
          return [{
            id: b.id,
            session_id: b.session_id,
            starts_at: s.starts_at,
            duration_minutes: s.duration_minutes,
            meeting_url: s.meeting_url,
            course_title: s.courses.title,
            course_slug: s.courses.slug,
          }];
        })
        .filter((b) => new Date(b.starts_at).getTime() >= now - 60 * 60 * 1000)
        .sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime());
    },
  });
}

export function useBookSession(courseId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (sessionId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Vous devez être connecté pour réserver.");
      const { error } = await supabase
        .from("session_bookings")
        .insert({ session_id: sessionId, user_id: user.id });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sessions", courseId] });
      qc.invalidateQueries({ queryKey: ["my-bookings"] });
    },
  });
}

export function useCancelBooking(courseId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (bookingId: string) => {
      const { error } = await supabase
        .from("session_bookings")
        .delete()
        .eq("id", bookingId);
      if (error) throw error;
    },
    onSuccess: () => {
      if (courseId) qc.invalidateQueries({ queryKey: ["sessions", courseId] });
      qc.invalidateQueries({ queryKey: ["my-bookings"] });
    },
  });
}
