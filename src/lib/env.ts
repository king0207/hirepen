/**
 * Provider-agnostic AI config. Works with any OpenAI-compatible API:
 * OpenAI, OpenRouter, Groq, Together, Azure OpenAI, DeepSeek, Qwen US, etc.
 *
 * Preferred env: AI_API_KEY / AI_BASE_URL / AI_MODEL.
 * Optional: AI_MODEL_PAID for Pro/Lifetime (defaults to AI_MODEL if unset).
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

  const paidModel =
    process.env.AI_MODEL_PAID?.trim() || model;

  return {
    apiKey,
    model,
    paidModel,
    baseUrl: baseUrl.replace(/\/$/, ""),
    provider: process.env.AI_PROVIDER?.trim() || (usingLegacyDeepSeek ? "deepseek" : "openai"),
  };
}

/** Free tier uses AI_MODEL; Pro/Lifetime use AI_MODEL_PAID when set. */
export function resolveAIModel(plan: "free" | "pro" | "lifetime" | undefined): string | undefined {
  const config = getAIConfig();
  if (!config) return undefined;
  if (plan === "pro" || plan === "lifetime") return config.paidModel;
  return config.model;
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

/**
 * Self-managed session secret (used to sign session JWTs and captcha cookies).
 * Generate with: openssl rand -base64 32
 */
export function getAuthSecret(): string | null {
  const secret = process.env.AUTH_SESSION_SECRET?.trim();
  if (!secret || secret.length < 16) return null;
  return secret;
}

/** Password/captcha login needs: a session secret + Supabase (for app_users storage). */
export function isPasswordAuthEnabled() {
  return Boolean(getAuthSecret() && getSupabaseConfig());
}

/** GitHub login needs: a session secret + Supabase public config (OAuth). */
export function isGithubAuthEnabled() {
  return Boolean(getAuthSecret() && getSupabasePublicConfig());
}

export function isAuthEnabled() {
  return isPasswordAuthEnabled() || isGithubAuthEnabled();
}

export function getFreeDailyLimit(): number {
  const raw = process.env.FREE_DAILY_LIMIT?.trim();
  const parsed = raw ? Number.parseInt(raw, 10) : 3;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 3;
}

export function getProMonthlyLimit(): number {
  const raw = process.env.PRO_MONTHLY_LIMIT?.trim();
  const parsed = raw ? Number.parseInt(raw, 10) : 50;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 50;
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

/** GA4 measurement ID (G-XXXXXXXX). Omit to disable analytics. */
export function getGa4MeasurementId(): string | null {
  const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
  if (!id || !id.startsWith("G-")) return null;
  return id;
}

export function isGa4Enabled() {
  return Boolean(getGa4MeasurementId());
}

/** Microsoft Clarity project ID. Omit to disable Clarity. */
export function getClarityProjectId(): string | null {
  const id = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID?.trim();
  return id || null;
}

export function isClarityEnabled() {
  return Boolean(getClarityProjectId());
}

export function getCreemConfig() {
  const apiKey = process.env.CREEM_API_KEY?.trim();
  const webhookSecret = process.env.CREEM_WEBHOOK_SECRET?.trim();
  if (!apiKey) return null;
  return {
    apiKey,
    apiBaseUrl: getCreemApiBaseUrl(apiKey),
    webhookSecret: webhookSecret || "",
    products: {
      pro: process.env.NEXT_PUBLIC_CREEM_PRODUCT_PRO?.trim() || "",
      lifetime: process.env.NEXT_PUBLIC_CREEM_PRODUCT_LIFETIME?.trim() || "",
    },
  };
}

/**
 * Creem API base URL. Override with CREEM_API_BASE_URL, or auto-detect from key prefix.
 * Test keys (creem_test_*) → https://test-api.creem.io
 * Live keys → https://api.creem.io
 */
export function getCreemApiBaseUrl(apiKey?: string): string {
  const explicit = process.env.CREEM_API_BASE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");

  const key = apiKey ?? process.env.CREEM_API_KEY?.trim() ?? "";
  if (key.startsWith("creem_test_")) {
    return "https://test-api.creem.io";
  }
  return "https://api.creem.io";
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

export type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
};

/** 163 requires a valid mailbox in From; bare "HirePen" is rejected. */
export function normalizeSmtpFrom(from: string, userEmail: string): string {
  const trimmed = from.trim();
  const email = userEmail.trim();
  if (!trimmed) return email;
  if (trimmed.includes("@")) return trimmed;
  return `${trimmed} <${email}>`;
}

/** 163 / custom SMTP for password-reset emails. Server-only env vars. */
export function getSmtpConfig(): SmtpConfig | null {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const fromRaw = process.env.SMTP_FROM?.trim();
  if (!host || !user || !pass) return null;

  const from = normalizeSmtpFrom(fromRaw || user, user);

  const portRaw = process.env.SMTP_PORT?.trim();
  const port = portRaw ? Number.parseInt(portRaw, 10) : 465;
  const secure =
    process.env.SMTP_SECURE?.trim() === "false" ? false : port === 465;

  return { host, port, secure, user, pass, from };
}

export function isPasswordResetEnabled() {
  return Boolean(isPasswordAuthEnabled() && getSmtpConfig());
}
