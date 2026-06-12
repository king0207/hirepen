import { z } from "zod";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { getSessionUser } from "@/lib/auth/session";
import { findUserById, updatePasswordHash } from "@/lib/auth/users";
import { isPasswordAuthEnabled } from "@/lib/env";

const schema = z.object({
  currentPassword: z.string().min(1).max(200),
  newPassword: z.string().min(8).max(200),
});

export async function POST(request: Request) {
  if (!isPasswordAuthEnabled()) {
    return Response.json(
      { error: "Password login is not configured." },
      { status: 503 },
    );
  }

  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return Response.json({ error: "Sign in to change your password." }, { status: 401 });
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
      { error: "Enter your current password and a new password of at least 8 characters." },
      { status: 400 },
    );
  }

  const { currentPassword, newPassword } = parsed.data;
  if (currentPassword === newPassword) {
    return Response.json(
      { error: "New password must be different from your current password." },
      { status: 400 },
    );
  }

  const user = await findUserById(sessionUser.id);
  if (!user || user.provider !== "password" || !user.password_hash) {
    return Response.json(
      { error: "Password change is only available for email & password accounts." },
      { status: 403 },
    );
  }

  if (!(await verifyPassword(currentPassword, user.password_hash))) {
    return Response.json({ error: "Current password is incorrect." }, { status: 401 });
  }

  const updated = await updatePasswordHash(user.id, await hashPassword(newPassword));
  if (!updated) {
    return Response.json({ error: "Could not update password." }, { status: 500 });
  }

  return Response.json({ ok: true });
}
