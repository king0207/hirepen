import { cookies } from "next/headers";
import { createHmac, randomInt, timingSafeEqual } from "crypto";
import { getAuthSecret } from "@/lib/env";

export const CAPTCHA_COOKIE = "hp_captcha";
const TTL_MS = 5 * 60 * 1000; // 5 minutes
const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous 0/O/1/I
const LENGTH = 5;

function generateCode(): string {
  let code = "";
  for (let i = 0; i < LENGTH; i++) {
    code += CHARS[randomInt(0, CHARS.length)];
  }
  return code;
}

function sign(value: string): string {
  const secret = getAuthSecret() ?? "dev-secret";
  return createHmac("sha256", secret).update(value).digest("hex");
}

/** Build the signed cookie payload for a code: `expiry.signature`. */
function buildCookie(code: string, expiry: number): string {
  const sig = sign(`${code.toLowerCase()}.${expiry}`);
  return `${expiry}.${sig}`;
}

/** Create a captcha, set its signed cookie, and return the rendered SVG. */
export async function issueCaptcha(): Promise<string> {
  const code = generateCode();
  const expiry = Date.now() + TTL_MS;

  const cookieStore = await cookies();
  cookieStore.set(CAPTCHA_COOKIE, buildCookie(code, expiry), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(TTL_MS / 1000),
  });

  return renderSvg(code);
}

/** Validate a user-entered captcha against the signed cookie. One-time use. */
export async function verifyCaptcha(input: string | undefined): Promise<boolean> {
  if (!input) return false;
  const cookieStore = await cookies();
  const raw = cookieStore.get(CAPTCHA_COOKIE)?.value;
  if (!raw) return false;

  // Invalidate immediately to prevent replay.
  cookieStore.delete(CAPTCHA_COOKIE);

  const dot = raw.lastIndexOf(".");
  if (dot < 0) return false;
  const expiry = Number(raw.slice(0, dot));
  const sig = raw.slice(dot + 1);
  if (!Number.isFinite(expiry) || Date.now() > expiry) return false;

  const expected = sign(`${input.trim().toLowerCase()}.${expiry}`);
  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

function renderSvg(code: string): string {
  const width = 140;
  const height = 48;
  const colors = ["#1f2937", "#0f766e", "#1d4ed8", "#9333ea", "#b45309"];

  const chars = code
    .split("")
    .map((ch, i) => {
      const x = 18 + i * 24 + randomInt(-3, 4);
      const y = 32 + randomInt(-4, 5);
      const rot = randomInt(-25, 26);
      const color = colors[randomInt(0, colors.length)];
      return `<text x="${x}" y="${y}" fill="${color}" font-size="26" font-family="monospace" font-weight="bold" transform="rotate(${rot} ${x} ${y})">${ch}</text>`;
    })
    .join("");

  let lines = "";
  for (let i = 0; i < 4; i++) {
    const x1 = randomInt(0, width);
    const y1 = randomInt(0, height);
    const x2 = randomInt(0, width);
    const y2 = randomInt(0, height);
    const color = colors[randomInt(0, colors.length)];
    lines += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="1" opacity="0.4"/>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="#f1f5f9"/>${lines}${chars}</svg>`;
}
