import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { getAuthSecret } from "@/lib/env";

export const SESSION_COOKIE = "hp_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

export type SessionUser = {
  id: string;
  email: string;
  isAdmin: boolean;
  provider: "password" | "github";
};

function getKey(): Uint8Array | null {
  const secret = getAuthSecret();
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

export async function createSession(user: SessionUser): Promise<void> {
  const key = getKey();
  if (!key) throw new Error("AUTH_SESSION_SECRET is not configured");

  const token = await new SignJWT({
    email: user.email,
    isAdmin: user.isAdmin,
    provider: user.provider,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const key = getKey();
  if (!key) return null;

  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, key);
    if (!payload.sub) return null;
    return {
      id: payload.sub,
      email: String(payload.email ?? ""),
      isAdmin: Boolean(payload.isAdmin),
      provider: (payload.provider as "password" | "github") ?? "password",
    };
  } catch {
    return null;
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

/** Verify a raw token string (used by proxy where cookies() helpers differ). */
export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  const key = getKey();
  if (!key || !token) return false;
  try {
    await jwtVerify(token, key);
    return true;
  } catch {
    return false;
  }
}
