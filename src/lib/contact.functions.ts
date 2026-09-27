import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254),
  message: z.string().trim().min(10).max(2000),
});

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("contact_messages")
      .insert(data)
      .select("id")
      .single();
    if (error || !row) throw new Error("Envoi impossible");
    try {
      const { sendTemplateEmail } = await import("@/lib/email-templates/send-email");
      await sendTemplateEmail("admin-notification", "contact@polylinguist.fr", {
        templateData: { kind: "contact", ...data },
        idempotencyKey: `contact-admin-${row.id}`,
      });
    } catch (e) {
      console.error("contact email failed", e);
    }
    return { ok: true };
  });
