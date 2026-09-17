import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const guestOrderSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254),
  items: z
    .array(
      z.object({
        courseId: z.string().uuid(),
        sessionId: z.string().uuid().nullable().optional(),
      }),
    )
    .min(1)
    .max(20),
});

export type GuestOrderInput = z.infer<typeof guestOrderSchema>;

export const createGuestOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => guestOrderSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const courseIds = [...new Set(data.items.map((i) => i.courseId))];
    const { data: courses, error: coursesError } = await supabaseAdmin
      .from("courses")
      .select("id, title, price_cents")
      .in("id", courseIds);
    if (coursesError) throw new Error(coursesError.message);
    if (!courses || courses.length !== courseIds.length) throw new Error("Cours introuvable");

    const byId = new Map(courses.map((c) => [c.id, c]));
    const totalCents = data.items.reduce((sum, i) => sum + (byId.get(i.courseId)?.price_cents ?? 0), 0);

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: null,
        guest_email: data.email,
        total_cents: totalCents,
        status: "completed",
        billing_name: data.name,
        billing_email: data.email,
      })
      .select("id")
      .single();
    if (orderError || !order) throw new Error(orderError?.message ?? "Commande impossible");

    const { error: itemsError } = await supabaseAdmin.from("order_items").insert(
      data.items.map((i) => ({
        order_id: order.id,
        course_id: i.courseId,
        course_title: byId.get(i.courseId)!.title,
        price_cents: byId.get(i.courseId)!.price_cents,
        quantity: 1,
      })),
    );
    if (itemsError) throw new Error(itemsError.message);

    const sessionIds = data.items.map((i) => i.sessionId).filter((s): s is string => !!s);
    if (sessionIds.length > 0) {
      const { data: sessions } = await supabaseAdmin
        .from("sessions")
        .select("id, capacity, course_id")
        .in("id", sessionIds);
      const { data: counts } = await supabaseAdmin
        .from("session_booking_counts")
        .select("session_id, booked_count")
        .in("session_id", sessionIds);
      const booked = new Map((counts ?? []).map((c) => [c.session_id, c.booked_count ?? 0]));

      const bookable = (sessions ?? []).filter((s) => (booked.get(s.id) ?? 0) < s.capacity);
      if (bookable.length > 0) {
        const { error: bookingError } = await supabaseAdmin.from("session_bookings").insert(
          bookable.map((s) => ({
            session_id: s.id,
            user_id: null,
            guest_email: data.email,
            order_id: order.id,
          })),
        );
        if (bookingError) throw new Error(bookingError.message);
      }
      if (bookable.length < sessionIds.length) {
        return { orderId: order.id, totalCents, warning: "Un créneau était complet et n'a pas été réservé." };
      }
    }

    return { orderId: order.id, totalCents, warning: null as string | null };
  });
