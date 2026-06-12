import { getSessionUser } from "@/lib/auth/session";
import { getUserPlan, shouldShowAds } from "@/lib/plans";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getSessionUser();
  const headers = { "Cache-Control": "no-store" };
  if (!user) return Response.json({ user: null }, { headers });

  const plan = await getUserPlan(user.id);

  return Response.json(
    {
      user: {
        email: user.email,
        isAdmin: user.isAdmin,
        provider: user.provider,
        plan,
        showAds: shouldShowAds(plan),
      },
    },
    { headers },
  );
}
