import { findUserByEmail } from "@/lib/auth/users";
import { getCreemConfig, getFreeDailyLimit, getProMonthlyLimit } from "@/lib/env";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export type UserPlan = "free" | "pro" | "lifetime";

export function shouldShowAds(plan: UserPlan): boolean {
  return plan === "free";
}

export function planLabel(plan: UserPlan): string {
  switch (plan) {
    case "pro":
      return "Pro";
    case "lifetime":
      return "Lifetime";
    default:
      return "Free";
  }
}

export function planFromCreemProduct(productId: string): UserPlan | null {
  const config = getCreemConfig();
  if (!config || !productId) return null;
  if (productId === config.products.lifetime) return "lifetime";
  if (productId === config.products.pro) return "pro";
  return null;
}

export async function getUserPlan(userId: string): Promise<UserPlan> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return "free";

  const { data, error } = await supabase
    .from("app_users")
    .select("plan")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data?.plan) return "free";
  const plan = data.plan as string;
  if (plan === "pro" || plan === "lifetime") return plan;
  return "free";
}

export async function setUserPlan(
  opts: {
    userId?: string | null;
    email?: string | null;
    plan: UserPlan;
    creemCustomerId?: string | null;
  },
): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return false;

  let userId = opts.userId?.trim() || null;
  const email = opts.email?.trim().toLowerCase() || null;

  if (!userId && email) {
    const user = await findUserByEmail(email);
    userId = user?.id ?? null;
  }

  if (!userId) {
    console.warn("[plans] setUserPlan: no matching user", { email, plan: opts.plan });
    return false;
  }

  const patch: Record<string, unknown> = {
    plan: opts.plan,
    plan_updated_at: new Date().toISOString(),
  };
  if (opts.creemCustomerId) {
    patch.creem_customer_id = opts.creemCustomerId;
  }

  const { error } = await supabase.from("app_users").update(patch).eq("id", userId);
  if (error) {
    console.error("[plans] setUserPlan failed:", error.message);
    return false;
  }
  return true;
}

export type PlanLimits = {
  daily: number;
  monthly: number;
};

export function getPlanLimits(): PlanLimits {
  return {
    daily: getFreeDailyLimit(),
    monthly: getProMonthlyLimit(),
  };
}

export type CreemCheckoutContext = {
  email: string | null;
  userId: string | null;
  productId: string | null;
  creemCustomerId: string | null;
};

/** Extract user/product info from Creem webhook `data` payloads. */
export function parseCreemEventData(data: Record<string, unknown> | undefined): CreemCheckoutContext {
  if (!data) {
    return { email: null, userId: null, productId: null, creemCustomerId: null };
  }

  const metadata = (data.metadata ?? {}) as Record<string, unknown>;
  const customer = (data.customer ?? {}) as Record<string, unknown>;

  const emailRaw =
    metadata.email ??
    customer.email ??
    data.customer_email ??
    data.email;
  const userIdRaw = metadata.user_id ?? metadata.userId ?? metadata.userID;
  const productIdRaw = data.product_id ?? data.productId;
  const customerIdRaw = data.customer_id ?? data.customerId ?? customer.id;

  return {
    email: emailRaw ? String(emailRaw).trim().toLowerCase() : null,
    userId: userIdRaw ? String(userIdRaw).trim() : null,
    productId: productIdRaw ? String(productIdRaw).trim() : null,
    creemCustomerId: customerIdRaw ? String(customerIdRaw).trim() : null,
  };
}

export async function applyPlanFromCreemProduct(ctx: CreemCheckoutContext): Promise<boolean> {
  if (!ctx.productId) return false;
  const plan = planFromCreemProduct(ctx.productId);
  if (!plan) {
    console.warn("[plans] unknown Creem product:", ctx.productId);
    return false;
  }
  return setUserPlan({
    userId: ctx.userId,
    email: ctx.email,
    plan,
    creemCustomerId: ctx.creemCustomerId,
  });
}

/** Downgrade pro subscribers; lifetime is never revoked by subscription events. */
export async function downgradeProUser(ctx: CreemCheckoutContext): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return false;

  let userId = ctx.userId;
  if (!userId && ctx.email) {
    const user = await findUserByEmail(ctx.email);
    userId = user?.id ?? null;
  }
  if (!userId) return false;

  const { data } = await supabase
    .from("app_users")
    .select("plan")
    .eq("id", userId)
    .maybeSingle();

  if (data?.plan !== "pro") return false;

  return setUserPlan({ userId, plan: "free" });
}
