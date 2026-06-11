import { getSupabaseAdmin } from "@/lib/supabase/server";

export type AppUser = {
  id: string;
  email: string;
  password_hash: string | null;
  provider: "password" | "github";
  github_id: string | null;
  is_admin: boolean;
  created_at: string;
};

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
