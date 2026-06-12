export const SITE_NAME = "HirePen";

/** Public support email (Creem onboarding, Privacy/Terms, footer). */
export function getSupportEmail(): string | null {
  const email = process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim();
  return email || null;
}

export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (url) return url.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}
