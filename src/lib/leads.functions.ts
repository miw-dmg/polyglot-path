import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const LEAD_GOALS = [
  "Parler anglais avec plus d'aisance",
  "Anglais professionnel",
  "Préparer un examen",
  "Préparer un voyage / expatriation",
  "Autre",
] as const;

const leadSchema = z.object({
  firstName: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  goal: z.enum(LEAD_GOALS),
  source: z.string().max(200).optional(),
});

export const captureLead = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => leadSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("leads")
      .insert({
        first_name: data.firstName,
        email: data.email,
        phone: data.phone || null,
        goal: data.goal,
        source: data.source ?? null,
      })
      .select("id")
      .single();
    if (error || !row) throw new Error("Impossible d'enregistrer vos coordonnées, réessayez.");

    try {
      const { sendTemplateEmail } = await import("@/lib/email-templates/send-email");
      await sendTemplateEmail("admin-notification", "contact@polylinguist.fr", {
        templateData: {
          kind: "contact",
          name: data.firstName,
          email: data.email,
          message: `Nouveau contact depuis la séance d'essai gratuite (créneau pas encore choisi).\nObjectif : ${data.goal}\nTéléphone : ${data.phone || "non renseigné"}`,
        },
        idempotencyKey: `lead-admin-${row.id}`,
      });
    } catch (e) {
      console.error("lead email failed", e);
    }
    return { leadId: row.id };
  });

export const markLeadBooked = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({ leadId: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("leads").update({ booked: true }).eq("id", data.leadId);
    return { ok: true };
  });
