import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const trialSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254),
  courseId: z.string().uuid(),
  sessionId: z.string().uuid(),
});

export type TrialInput = z.infer<typeof trialSchema>;

export const bookTrialSession = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => trialSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: course, error: courseError } = await supabaseAdmin
      .from("courses")
      .select("id, title")
      .eq("id", data.courseId)
      .maybeSingle();
    if (courseError) throw new Error(courseError.message);
    if (!course) throw new Error("Cours introuvable");

    const { data: session, error: sessionError } = await supabaseAdmin
      .from("sessions")
      .select("id, capacity, course_id, starts_at, meeting_url")
      .eq("id", data.sessionId)
      .maybeSingle();
    if (sessionError) throw new Error(sessionError.message);
    if (!session || session.course_id !== course.id) throw new Error("Créneau introuvable");

    const { data: counts } = await supabaseAdmin
      .from("session_booking_counts")
      .select("session_id, booked_count")
      .eq("session_id", session.id);
    const booked = counts?.[0]?.booked_count ?? 0;
    if (booked >= session.capacity) throw new Error("Ce créneau est complet, choisissez-en un autre.");

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: null,
        guest_email: data.email,
        total_cents: 0,
        status: "completed",
        billing_name: data.name,
        billing_email: data.email,
      })
      .select("id")
      .single();
    if (orderError || !order) throw new Error(orderError?.message ?? "Réservation impossible");

    const { error: itemError } = await supabaseAdmin.from("order_items").insert({
      order_id: order.id,
      course_id: course.id,
      course_title: `${course.title} — séance d'essai gratuite`,
      price_cents: 0,
      quantity: 1,
    });
    if (itemError) throw new Error(itemError.message);

    const { error: bookingError } = await supabaseAdmin.from("session_bookings").insert({
      session_id: session.id,
      user_id: null,
      guest_email: data.email,
      order_id: order.id,
    });
    if (bookingError) throw new Error(bookingError.message);

    return {
      orderId: order.id,
      courseTitle: course.title,
      startsAt: session.starts_at,
      meetingUrl: session.meeting_url,
    };
  });
