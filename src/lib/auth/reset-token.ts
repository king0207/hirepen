import { createHash, randomBytes } from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { hashPassword } from "@/lib/auth/password";
import { findUserByEmail, updatePasswordHash } from "@/lib/auth/users";

const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** Create a reset token for a password account. Returns plain token for the email link. */
export async function createPasswordResetToken(email: string): Promise<string | null> {
  const user = await findUserByEmail(email);
  if (!user || user.provider !== "password" || !user.password_hash) {
    return null;
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const token = randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS).toISOString();

  await supabase.from("password_reset_tokens").delete().eq("user_id", user.id);

  const { error } = await supabase.from("password_reset_tokens").insert({
    user_id: user.id,
    token_hash: tokenHash,
    expires_at: expiresAt,
  });

  if (error) {
    console.error("[auth] createPasswordResetToken failed:", error.message);
    return null;
  }

  return token;
}

/** Verify token and set a new password. Returns true on success. */
export async function resetPasswordWithToken(
  token: string,
  newPassword: string,
): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  if (!supabase || !token) return false;

  const tokenHash = hashToken(token);
  const { data: row } = await supabase
    .from("password_reset_tokens")
    .select("id, user_id, expires_at")
    .eq("token_hash", tokenHash)
    .maybeSingle();

  if (!row) return false;
  if (new Date(row.expires_at).getTime() < Date.now()) {
    await supabase.from("password_reset_tokens").delete().eq("id", row.id);
    return false;
  }

  const passwordHash = await hashPassword(newPassword);
  const updated = await updatePasswordHash(row.user_id, passwordHash);
  if (!updated) {
    console.error("[auth] resetPasswordWithToken update failed");
  }
  return updated;
}
