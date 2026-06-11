import { z } from "zod";
import { isPasswordAuthEnabled } from "@/lib/env";
import { verifyCaptcha } from "@/lib/auth/captcha";
import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { findUserByEmail } from "@/lib/auth/users";

const schema = z.object({
  email: z.email().max(200),
  password: z.string().min(1).max(200),
  captcha: z.string().min(1).max(16),
});

export async function POST(request: Request) {
  if (!isPasswordAuthEnabled()) {
    return Response.json(
      { error: "Account login is not configured." },
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
    return Response.json({ error: "Invalid email or password." }, { status: 400 });
  }

  const { email, password, captcha } = parsed.data;

  if (!(await verifyCaptcha(captcha))) {
    return Response.json({ error: "Incorrect or expired captcha." }, { status: 400 });
  }

  const user = await findUserByEmail(email);
  if (!user || !(await verifyPassword(password, user.password_hash))) {
    return Response.json({ error: "Incorrect email or password." }, { status: 401 });
  }

  await createSession({
    id: user.id,
    email: user.email,
    isAdmin: user.is_admin,
    provider: "password",
  });

  return Response.json({ ok: true });
}
