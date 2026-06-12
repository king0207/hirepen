import { getFreeDailyLimit, getProMonthlyLimit } from "@/lib/env";
import type { UserPlan } from "@/lib/plans";
import { getSupabaseAdmin } from "@/lib/supabase/server";

const memoryUsage = new Map<string, { date: string; count: number }>();

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function monthStartKey(): string {
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, "0");
  return `${y}-${m}-01`;
}

function memoryKey(bucketId: string, periodKey: string): string {
  return `${bucketId}:${periodKey}`;
}

function usageBucketId(sessionId: string, userId?: string | null): string {
  return userId ? `user:${userId}` : sessionId;
}

async function getCount(bucketId: string, periodKey: string): Promise<number> {
  const supabase = getSupabaseAdmin();

  if (supabase) {
    const { data } = await supabase
      .from("usage_limits")
      .select("count")
      .eq("session_id", bucketId)
      .eq("usage_date", periodKey)
      .maybeSingle();

    return data?.count ?? 0;
  }

  return memoryUsage.get(memoryKey(bucketId, periodKey))?.count ?? 0;
}

async function incrementCount(bucketId: string, periodKey: string, userId?: string | null): Promise<number> {
  const supabase = getSupabaseAdmin();

  if (supabase) {
    const current = await getCount(bucketId, periodKey);
    const next = current + 1;

    await supabase.from("usage_limits").upsert(
      {
        session_id: bucketId,
        user_id: userId ?? null,
        usage_date: periodKey,
        count: next,
      },
      { onConflict: "session_id,usage_date" },
    );

    return next;
  }

  const key = memoryKey(bucketId, periodKey);
  const next = (memoryUsage.get(key)?.count ?? 0) + 1;
  memoryUsage.set(key, { date: periodKey, count: next });
  return next;
}

export type UsageCheckResult = {
  allowed: boolean;
  used: number;
  limit: number;
  period: "day" | "month" | "unlimited";
};

export async function checkAndRecordUsage(opts: {
  sessionId: string;
  userId?: string | null;
  plan?: UserPlan;
  isAdmin?: boolean;
}): Promise<UsageCheckResult> {
  const { sessionId, userId, plan = "free", isAdmin } = opts;

  if (isAdmin || plan === "lifetime") {
    return { allowed: true, used: 0, limit: Infinity, period: "unlimited" };
  }

  const bucketId = usageBucketId(sessionId, userId);

  if (plan === "pro" && userId) {
    const limit = getProMonthlyLimit();
    const periodKey = monthStartKey();
    const used = await getCount(bucketId, periodKey);

    if (used >= limit) {
      return { allowed: false, used, limit, period: "month" };
    }

    const newCount = await incrementCount(bucketId, periodKey, userId);
    return { allowed: true, used: newCount, limit, period: "month" };
  }

  const limit = getFreeDailyLimit();
  const periodKey = todayKey();
  const used = await getCount(bucketId, periodKey);

  if (used >= limit) {
    return { allowed: false, used, limit, period: "day" };
  }

  const newCount = await incrementCount(bucketId, periodKey, userId);
  return { allowed: true, used: newCount, limit, period: "day" };
}

export async function logGeneration(params: {
  sessionId: string;
  userId?: string | null;
  professionSlug: string;
  docType: "resume" | "cover_letter";
}): Promise<void> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  await supabase.from("generations").insert({
    session_id: params.sessionId,
    user_id: params.userId ?? null,
    profession_slug: params.professionSlug,
    doc_type: params.docType,
  });
}
