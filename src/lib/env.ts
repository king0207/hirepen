/**
 * Provider-agnostic AI config. Works with any OpenAI-compatible API:
 * OpenAI, OpenRouter, Groq, Together, Azure OpenAI, DeepSeek, etc.
 *
 * Preferred env: AI_API_KEY / AI_BASE_URL / AI_MODEL.
 * Legacy fallback: DEEPSEEK_API_KEY / DEEPSEEK_BASE_URL / DEEPSEEK_MODEL.
 */
export function getAIConfig() {
  const apiKey =
    process.env.AI_API_KEY?.trim() || process.env.DEEPSEEK_API_KEY?.trim();
  if (!apiKey) return null;

  const usingLegacyDeepSeek =
    !process.env.AI_API_KEY?.trim() && Boolean(process.env.DEEPSEEK_API_KEY?.trim());

  const baseUrl =
    process.env.AI_BASE_URL?.trim() ||
    process.env.DEEPSEEK_BASE_URL?.trim() ||
    (usingLegacyDeepSeek
      ? "https://api.deepseek.com/v1"
      : "https://api.openai.com/v1");

  const model =
    process.env.AI_MODEL?.trim() ||
    process.env.DEEPSEEK_MODEL?.trim() ||
    (usingLegacyDeepSeek ? "deepseek-chat" : "gpt-4o-mini");

  return {
    apiKey,
    model,
    baseUrl: baseUrl.replace(/\/$/, ""),
    provider: process.env.AI_PROVIDER?.trim() || (usingLegacyDeepSeek ? "deepseek" : "openai"),
  };
}

export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !serviceRoleKey) return null;
  return { url, serviceRoleKey };
}

/**
 * Public Supabase config (URL + anon key). Safe for browser + auth flows.
 * Required for login (account/password and email OTP code).
 */
export function getSupabasePublicConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !anonKey) return null;
  return { url, anonKey };
}

export function isAuthEnabled() {
  return Boolean(getSupabasePublicConfig());
}

export function getFreeDailyLimit(): number {
  const raw = process.env.FREE_DAILY_LIMIT?.trim();
  const parsed = raw ? Number.parseInt(raw, 10) : 3;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 3;
}

export function getAdSenseConfig() {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim();
  if (!client) return null;
  return {
    client,
    slotTop: process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP?.trim() || "",
    slotBottom: process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM?.trim() || "",
  };
}

export function isAdSenseEnabled() {
  const config = getAdSenseConfig();
  return Boolean(config?.client);
}

export function getCreemConfig() {
  const apiKey = process.env.CREEM_API_KEY?.trim();
  const webhookSecret = process.env.CREEM_WEBHOOK_SECRET?.trim();
  if (!apiKey) return null;
  return {
    apiKey,
    webhookSecret: webhookSecret || "",
    products: {
      pro: process.env.NEXT_PUBLIC_CREEM_PRODUCT_PRO?.trim() || "",
      lifetime: process.env.NEXT_PUBLIC_CREEM_PRODUCT_LIFETIME?.trim() || "",
    },
  };
}

export function isCreemEnabled() {
  const config = getCreemConfig();
  return Boolean(config?.apiKey);
}

export function getCreemProductId(plan: "pro" | "lifetime"): string | null {
  const config = getCreemConfig();
  if (!config) return null;
  const id = config.products[plan];
  return id || null;
}
