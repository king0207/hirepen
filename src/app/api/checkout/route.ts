import { z } from "zod";
import { createCreemCheckout } from "@/lib/creem";

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

  const result = await createCreemCheckout(parsed.data.plan);

  if (!result.ok) {
    return Response.json(
      { error: result.error, configured: false },
      { status: result.error?.includes("not configured") ? 503 : 502 },
    );
  }

  return Response.json({ checkoutUrl: result.checkoutUrl, configured: true });
}
