import { NextResponse } from "next/server";
import { isGithubAuthEnabled } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSession } from "@/lib/auth/session";
import { upsertGithubUser } from "@/lib/auth/users";

/**
 * GitHub OAuth callback.
 * Exchanges the Supabase OAuth code, reads the GitHub user, upserts them into
 * `app_users`, then issues OUR OWN signed session (and clears the Supabase one).
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/";

  const fail = (reason: string) =>
    NextResponse.redirect(new URL(`/login?error=${reason}`, url.origin));

  if (!isGithubAuthEnabled() || !code) {
    return fail("github_unavailable");
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) return fail("github_unavailable");

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return fail("oauth_failed");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    await supabase.auth.signOut();
    return fail("no_email");
  }

  const githubId =
    (user.user_metadata?.provider_id as string | undefined) ||
    (user.user_metadata?.sub as string | undefined) ||
    user.id;

  const appUser = await upsertGithubUser(user.email, githubId);

  // Clear the Supabase session — we use our own session cookie exclusively.
  await supabase.auth.signOut();

  if (!appUser) return fail("user_failed");

  await createSession({
    id: appUser.id,
    email: appUser.email,
    isAdmin: appUser.is_admin,
    provider: "github",
  });

  return NextResponse.redirect(new URL(next, url.origin));
}
