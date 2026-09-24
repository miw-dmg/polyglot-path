import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";

// Shopify "orders/paid" webhook: books each paid slot atomically (1 seat per session).
export const Route = createFileRoute("/api/public/shopify-order")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env["SHOPIFY_WEBHOOK_SECRET"];
        if (!secret) return new Response("Not configured", { status: 503 });
        const body = await request.text();
        const sig = request.headers.get("x-shopify-hmac-sha256") ?? "";
        const expected = createHmac("sha256", secret).update(body, "utf8").digest("base64");
        const a = Buffer.from(sig);
        const b = Buffer.from(expected);
        if (a.length !== b.length || !timingSafeEqual(a, b)) return new Response("Invalid signature", { status: 401 });

        const order = JSON.parse(body) as {
          email?: string;
          line_items?: Array<{ properties?: Array<{ name: string; value: string }> }>;
        };
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const conflicts: string[] = [];
        for (const li of order.line_items ?? []) {
          const sessionId = li.properties?.find((p) => p.name === "_session_id")?.value;
          if (!sessionId || !/^[0-9a-f-]{36}$/i.test(sessionId)) continue;
          const { error } = await supabaseAdmin
            .from("session_bookings")
            .insert({ session_id: sessionId, guest_email: order.email ?? null });
          if (error) conflicts.push(sessionId);
        }
        if (conflicts.length) console.error("Slot already taken for paid order", conflicts);
        return new Response("ok");
      },
    },
  },
});
