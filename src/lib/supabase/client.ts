import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublicConfig } from "@/lib/env";

/**
 * Browser Supabase client for auth (login / signup / OTP) in Client Components.
 * Returns null when Supabase env vars are not configured.
 */
export function createSupabaseBrowserClient() {
  const config = getSupabasePublicConfig();
  if (!config) return null;
  return createBrowserClient(config.url, config.anonKey);
}
