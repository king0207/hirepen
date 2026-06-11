import { getSessionUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getSessionUser();
  const headers = { "Cache-Control": "no-store" };
  if (!user) return Response.json({ user: null }, { headers });
  return Response.json(
    { user: { email: user.email, isAdmin: user.isAdmin, provider: user.provider } },
    { headers },
  );
}
