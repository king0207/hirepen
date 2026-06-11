import { createHmac, timingSafeEqual } from "crypto";
import { getSiteUrl } from "@/config/site";
import { getCreemConfig } from "@/lib/env";

export type CreemPlan = "pro" | "lifetime";

type CheckoutResponse = {
  id?: string;
  checkout_url?: string;
  url?: string;
  error?: string;
  message?: string;
};

export async function createCreemCheckout(plan: CreemPlan): Promise<{
  ok: boolean;
  checkoutUrl?: string;
  error?: string;
}> {
  const config = getCreemConfig();
  if (!config) {
    return { ok: false, error: "Creem is not configured. Set CREEM_API_KEY." };
  }

  const productId = config.products[plan];
  if (!productId) {
    return {
      ok: false,
      error: `Creem product for "${plan}" is not configured.`,
    };
  }

  const siteUrl = getSiteUrl();
  const response = await fetch("https://api.creem.io/v1/checkouts", {
    method: "POST",
    headers: {
      "x-api-key": config.apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      product_id: productId,
      success_url: `${siteUrl}/pricing?checkout=success&plan=${plan}`,
      request_id: `plan_${plan}_${Date.now()}`,
    }),
  });

  const data = (await response.json()) as CheckoutResponse;

  if (!response.ok) {
    return {
      ok: false,
      error: data.message || data.error || "Failed to create checkout session",
    };
  }

  const checkoutUrl = data.checkout_url || data.url;
  if (!checkoutUrl) {
    return { ok: false, error: "Checkout URL missing from Creem response" };
  }

  return { ok: true, checkoutUrl };
}

export function verifyCreemWebhookSignature(
  body: string,
  signature: string | null,
): boolean {
  const config = getCreemConfig();
  if (!config?.webhookSecret || !signature) return false;

  const digest = createHmac("sha256", config.webhookSecret)
    .update(body)
    .digest("hex");

  try {
    return timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
  } catch {
    return signature === digest;
  }
}
