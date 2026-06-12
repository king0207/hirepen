import { getSiteUrl } from "@/config/site";
import { createPasswordResetToken } from "@/lib/auth/reset-token";
import { getSessionUser } from "@/lib/auth/session";
import { findUserById } from "@/lib/auth/users";
import { sendPasswordResetEmail } from "@/lib/email";
import { isPasswordResetEnabled } from "@/lib/env";

export async function POST() {
  if (!isPasswordResetEnabled()) {
    return Response.json(
      { error: "Email password reset is not configured." },
      { status: 503 },
    );
  }

  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return Response.json({ error: "Sign in to request a reset link." }, { status: 401 });
  }

  const user = await findUserById(sessionUser.id);
  if (!user || user.provider !== "password" || !user.password_hash) {
    return Response.json(
      { error: "Email reset is only available for email & password accounts." },
      { status: 403 },
    );
  }

  const token = await createPasswordResetToken(user.email);
  if (!token) {
    return Response.json({ error: "Could not create reset link." }, { status: 500 });
  }

  const resetUrl = `${getSiteUrl()}/reset-password?token=${encodeURIComponent(token)}`;
  const sent = await sendPasswordResetEmail({ to: user.email, resetUrl });

  if (!sent.ok) {
    console.error("[auth] request-reset-email failed:", sent.error);
    return Response.json(
      { error: "Could not send reset email. Check SMTP settings." },
      { status: 502 },
    );
  }

  return Response.json({
    ok: true,
    message: `We sent a reset link to ${user.email}. The link expires in 1 hour.`,
  });
}
