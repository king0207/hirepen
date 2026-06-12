import { z } from "zod";
import { getSiteUrl } from "@/config/site";
import { isPasswordResetEnabled } from "@/lib/env";
import { createPasswordResetToken } from "@/lib/auth/reset-token";
import { sendPasswordResetEmail } from "@/lib/email";

const schema = z.object({
  email: z.email().max(200),
});

export async function POST(request: Request) {
  if (!isPasswordResetEnabled()) {
    return Response.json(
      { error: "Password reset is not configured." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const email = parsed.data.email.trim();
  const token = await createPasswordResetToken(email);

  // Always respond the same way — do not reveal whether the email exists.
  const genericOk = {
    ok: true,
    message: "If an account exists for that email, we sent a reset link.",
  };

  if (!token) {
    return Response.json(genericOk);
  }

  const resetUrl = `${getSiteUrl()}/reset-password?token=${encodeURIComponent(token)}`;
  const sent = await sendPasswordResetEmail({ to: email, resetUrl });

  if (!sent.ok) {
    console.error("[auth] forgot-password email failed:", sent.error);
    return Response.json(
      { error: "Could not send reset email. Check SMTP settings." },
      { status: 502 },
    );
  }

  return Response.json(genericOk);
}
