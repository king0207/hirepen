import { getSupabaseAdmin } from "@/lib/supabase/server";
import { verifyCreemWebhookSignature } from "@/lib/creem";
import {
  applyPlanFromCreemProduct,
  downgradeProUser,
  parseCreemEventData,
  parseCreemWebhookEvent,
} from "@/lib/plans";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("creem-signature");

  if (!verifyCreemWebhookSignature(body, signature)) {
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  }

  let raw: Record<string, unknown>;

  try {
    raw = JSON.parse(body) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { eventType, payload } = parseCreemWebhookEvent(raw);

  const supabase = getSupabaseAdmin();
  if (supabase) {
    await supabase.from("payment_events").insert({
      event_type: eventType,
      payload: raw,
    });
  }

  const ctx = parseCreemEventData(payload);

  switch (eventType) {
    case "checkout.completed":
      await applyPlanFromCreemProduct(ctx);
      break;
    case "subscription.created":
    case "subscription.active":
    case "subscription.paid":
      await applyPlanFromCreemProduct(ctx);
      break;
    case "subscription.canceled":
    case "subscription.expired":
      await downgradeProUser(ctx);
      break;
    default:
      break;
  }

  return Response.json({ received: true });
}
