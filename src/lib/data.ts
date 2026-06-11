import { getSupabaseAdmin } from "@/lib/supabase/server";
import type { AppUser } from "@/lib/auth/users";

export type GenerationRow = {
  id: string;
  session_id: string | null;
  user_id: string | null;
  profession_slug: string;
  doc_type: "resume" | "cover_letter";
  created_at: string;
};

export type PaymentEventRow = {
  id: string;
  event_type: string;
  payload: unknown;
  created_at: string;
};

/** All accounts, newest first. Admin-only data. */
export async function listAppUsers(limit = 200): Promise<AppUser[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("app_users")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("[data] listAppUsers failed:", error.message);
    return [];
  }
  return (data as AppUser[]) ?? [];
}

/** Generation logs. Pass `userId` to scope to one user (account page). */
export async function listGenerations(opts: {
  userId?: string;
  limit?: number;
} = {}): Promise<GenerationRow[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];
  let query = supabase
    .from("generations")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(opts.limit ?? 50);
  if (opts.userId) query = query.eq("user_id", opts.userId);
  const { data, error } = await query;
  if (error) {
    console.error("[data] listGenerations failed:", error.message);
    return [];
  }
  return (data as GenerationRow[]) ?? [];
}

/** Creem webhook audit log, newest first. Admin-only data. */
export async function listPaymentEvents(limit = 50): Promise<PaymentEventRow[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("payment_events")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("[data] listPaymentEvents failed:", error.message);
    return [];
  }
  return (data as PaymentEventRow[]) ?? [];
}

export type AdminStats = {
  userCount: number;
  generationCount: number;
};

export async function getAdminStats(): Promise<AdminStats> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { userCount: 0, generationCount: 0 };
  const [users, gens] = await Promise.all([
    supabase.from("app_users").select("id", { count: "exact", head: true }),
    supabase.from("generations").select("id", { count: "exact", head: true }),
  ]);
  return {
    userCount: users.count ?? 0,
    generationCount: gens.count ?? 0,
  };
}
