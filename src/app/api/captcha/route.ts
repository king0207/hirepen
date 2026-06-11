import { issueCaptcha } from "@/lib/auth/captcha";

export const dynamic = "force-dynamic";

export async function GET() {
  const svg = await issueCaptcha();
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
