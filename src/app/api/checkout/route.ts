import { z } from "zod";
import { getSessionUser } from "@/lib/auth/session";
import { createCreemCheckout } from "@/lib/creem";
import { getCheckoutBlockReason, getUserPlan } from "@/lib/plans";

const checkoutSchema = z.object({
  plan: z.enum(["pro", "lifetime"]),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body", configured: false }, { status: 400 });
  }

  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid plan", configured: false }, { status: 400 });
  }

  const user = await getSessionUser();
  if (!user) {
    return Response.json(
      { error: "Log in before subscribing.", configured: true, requiresAuth: true },
      { status: 401 },
    );
  }

  const currentPlan = await getUserPlan(user.id);
  const blockReason = getCheckoutBlockReason(currentPlan, parsed.data.plan);
  if (blockReason) {
    return Response.json(
      { error: blockReason, configured: true, currentPlan },
      { status: 409 },
    );
  }

  const result = await createCreemCheckout(parsed.data.plan, {
    email: user.email,
    userId: user.id,
  });

  if (!result.ok) {
    return Response.json(
      { error: result.error, configured: false },
      { status: result.error?.includes("not configured") ? 503 : 502 },
    );
  }

  return Response.json({ checkoutUrl: result.checkoutUrl, configured: true });
}
