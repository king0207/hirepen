import { z } from "zod";
import { isPasswordResetEnabled } from "@/lib/env";
import { resetPasswordWithToken } from "@/lib/auth/reset-token";

const schema = z.object({
  token: z.string().min(1).max(128),
  password: z.string().min(8).max(200),
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
    return Response.json(
      { error: "Enter a valid token and a password of at least 8 characters." },
      { status: 400 },
    );
  }

  const ok = await resetPasswordWithToken(parsed.data.token, parsed.data.password);
  if (!ok) {
    return Response.json(
      { error: "This reset link is invalid or has expired." },
      { status: 400 },
    );
  }

  return Response.json({ ok: true });
}
