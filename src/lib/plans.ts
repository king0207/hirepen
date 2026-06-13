import { findUserByEmail } from "@/lib/auth/users";
import { getCreemConfig, getFreeDailyLimit, getProMonthlyLimit } from "@/lib/env";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export type UserPlan = "free" | "pro" | "lifetime";

const PLAN_RANK: Record<UserPlan, number> = {
  free: 0,
  pro: 1,
  lifetime: 2,
};

export function planRank(plan: UserPlan): number {
  return PLAN_RANK[plan];
}

/** Block checkout that would duplicate or downgrade the user's entitlements. */
export function getCheckoutBlockReason(
  currentPlan: UserPlan,
  targetPlan: "pro" | "lifetime",
): string | null {
  if (targetPlan === "pro") {
    if (currentPlan === "lifetime") {
      return "Lifetime already includes everything in Pro. Monthly Pro is not available.";
    }
    if (currentPlan === "pro") {
      return "You are already on Pro.";
    }
    return null;
  }

  if (currentPlan === "lifetime") {
    return "You already have Lifetime access.";
  }

  return null;
}

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

function readRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function readProductId(data: Record<string, unknown>, metadata: Record<string, unknown>): string | null {
  const product = data.product;
  const order = readRecord(data.order);

  const fromProduct =
    typeof product === "string"
      ? product
      : readRecord(product).id ?? data.product_id ?? data.productId;

  const raw =
    metadata.product_id ??
    fromProduct ??
    order.product ??
    readRecord(data.subscription).product;

  const subscriptionProduct = readRecord(data.subscription).product;
  const fromSubscription =
    typeof subscriptionProduct === "string"
      ? subscriptionProduct
      : readRecord(subscriptionProduct).id;

  const resolved = raw ?? fromSubscription;
  return resolved ? String(resolved).trim() : null;
}

/** Extract user/product info from Creem webhook `object` (or legacy `data`) payloads. */
export function parseCreemEventData(data: Record<string, unknown> | undefined): CreemCheckoutContext {
  if (!data) {
    return { email: null, userId: null, productId: null, creemCustomerId: null };
  }

  const metadata = {
    ...readRecord(readRecord(data.subscription).metadata),
    ...readRecord(data.metadata),
  };
  const customer = data.customer;
  const customerObj = readRecord(customer);

  const emailRaw =
    metadata.email ??
    customerObj.email ??
    data.customer_email ??
    data.email;
  const userIdRaw = metadata.user_id ?? metadata.userId ?? metadata.userID;
  const productIdRaw = readProductId(data, metadata);
  const customerIdRaw =
    (typeof customer === "string" ? customer : null) ??
    customerObj.id ??
    data.customer_id ??
    data.customerId;

  return {
    email: emailRaw ? String(emailRaw).trim().toLowerCase() : null,
    userId: userIdRaw ? String(userIdRaw).trim() : null,
    productId: productIdRaw,
    creemCustomerId: customerIdRaw ? String(customerIdRaw).trim() : null,
  };
}

/** Normalize Creem webhook envelope (`eventType` + `object`) and legacy shapes. */
export function parseCreemWebhookEvent(raw: Record<string, unknown>): {
  eventType: string;
  payload: Record<string, unknown> | undefined;
} {
  const eventType = String(raw.eventType ?? raw.type ?? "unknown").trim();
  const payload = readRecord(raw.object ?? raw.data);
  return {
    eventType,
    payload: Object.keys(payload).length > 0 ? payload : undefined,
  };
}

export async function applyPlanFromCreemProduct(ctx: CreemCheckoutContext): Promise<boolean> {
  if (!ctx.productId) return false;
  const plan = planFromCreemProduct(ctx.productId);
  if (!plan) {
    console.warn("[plans] unknown Creem product:", ctx.productId);
    return false;
  }

  let userId = ctx.userId?.trim() || null;
  const email = ctx.email?.trim().toLowerCase() || null;
  if (!userId && email) {
    const user = await findUserByEmail(email);
    userId = user?.id ?? null;
  }
  if (!userId) {
    console.warn("[plans] applyPlanFromCreemProduct: no matching user", { email, plan });
    return false;
  }

  const currentPlan = await getUserPlan(userId);
  if (planRank(plan) < planRank(currentPlan)) {
    console.info("[plans] ignoring webhook plan downgrade", {
      userId,
      currentPlan,
      incomingPlan: plan,
    });
    return true;
  }

  if (plan === currentPlan) {
    return setUserPlan({
      userId,
      email,
      plan,
      creemCustomerId: ctx.creemCustomerId,
    });
  }

  return setUserPlan({
    userId,
    email,
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
