import { getSupabaseAdmin } from "@/lib/supabase/server";

import type { UserPlan } from "@/lib/plans";

// plan columns added in supabase/migrations/003_user_plans.sql

export type AppUser = {
  id: string;
  email: string;
  password_hash: string | null;
  provider: "password" | "github";
  github_id: string | null;
  is_admin: boolean;
  plan: UserPlan;
  plan_updated_at: string | null;
  creem_customer_id: string | null;
  created_at: string;
};

export async function findUserById(id: string): Promise<AppUser | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("app_users")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    console.error("[auth] findUserById failed:", error.message, error);
    throw new Error(`findUserById: ${error.message}`);
  }
  return (data as AppUser | null) ?? null;
}

export async function updatePasswordHash(
  userId: string,
  passwordHash: string,
): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return false;

  const { error } = await supabase
    .from("app_users")
    .update({ password_hash: passwordHash })
    .eq("id", userId);

  if (error) {
    console.error("[auth] updatePasswordHash failed:", error.message);
    return false;
  }

  await supabase.from("password_reset_tokens").delete().eq("user_id", userId);
  return true;
}

export async function findUserByEmail(email: string): Promise<AppUser | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("app_users")
    .select("*")
    .ilike("email", email)
    .maybeSingle();
  if (error) {
    console.error("[auth] findUserByEmail failed:", error.message, error);
    throw new Error(`findUserByEmail: ${error.message}`);
  }
  return (data as AppUser | null) ?? null;
}

export async function createPasswordUser(
  email: string,
  passwordHash: string,
): Promise<AppUser | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("app_users")
    .insert({ email, password_hash: passwordHash, provider: "password" })
    .select("*")
    .single();
  if (error) {
    console.error("[auth] createPasswordUser failed:", error.message, error);
    throw new Error(`createPasswordUser: ${error.message}`);
  }
  return data as AppUser;
}

/** Upsert a GitHub OAuth user into app_users and return it. */
export async function upsertGithubUser(
  email: string,
  githubId: string,
): Promise<AppUser | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const existing = await findUserByEmail(email);
  if (existing) {
    if (!existing.github_id) {
      await supabase
        .from("app_users")
        .update({ github_id: githubId })
        .eq("id", existing.id);
    }
    return existing;
  }

  const { data, error } = await supabase
    .from("app_users")
    .insert({ email, provider: "github", github_id: githubId })
    .select("*")
    .single();
  if (error) return null;
  return data as AppUser;
}
