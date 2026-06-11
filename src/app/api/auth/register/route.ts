import { z } from "zod";
import { isPasswordAuthEnabled } from "@/lib/env";
import { verifyCaptcha } from "@/lib/auth/captcha";
import { hashPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { createPasswordUser, findUserByEmail } from "@/lib/auth/users";

const schema = z.object({
  email: z.email().max(200),
  password: z.string().min(8).max(200),
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
    return Response.json(
      { error: "Enter a valid email and a password of at least 8 characters." },
      { status: 400 },
    );
  }

  const { email, password, captcha } = parsed.data;

  if (!(await verifyCaptcha(captcha))) {
    return Response.json({ error: "Incorrect or expired captcha." }, { status: 400 });
  }

  try {
    const existing = await findUserByEmail(email);
    if (existing) {
      return Response.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const user = await createPasswordUser(email, await hashPassword(password));
    if (!user) {
      return Response.json({ error: "Could not create account." }, { status: 500 });
    }

    await createSession({
      id: user.id,
      email: user.email,
      isAdmin: user.is_admin,
      provider: "password",
    });

    return Response.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[auth] register error:", message);
    return Response.json(
      {
        error: "Registration failed. Check the server logs.",
        detail: process.env.NODE_ENV === "production" ? undefined : message,
      },
      { status: 500 },
    );
  }
}
