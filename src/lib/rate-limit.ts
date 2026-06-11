import { getFreeDailyLimit } from "@/lib/env";
import { getSupabaseAdmin } from "@/lib/supabase/server";

const memoryUsage = new Map<string, { date: string; count: number }>();

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function memoryKey(sessionId: string): string {
  return `${sessionId}:${todayKey()}`;
}

async function getCount(sessionId: string): Promise<number> {
  const supabase = getSupabaseAdmin();
  const date = todayKey();

  if (supabase) {
    const { data } = await supabase
      .from("usage_limits")
      .select("count")
      .eq("session_id", sessionId)
      .eq("usage_date", date)
      .maybeSingle();

    return data?.count ?? 0;
  }

  return memoryUsage.get(memoryKey(sessionId))?.count ?? 0;
}

async function incrementCount(sessionId: string): Promise<number> {
  const supabase = getSupabaseAdmin();
  const date = todayKey();

  if (supabase) {
    const current = await getCount(sessionId);
    const next = current + 1;

    await supabase.from("usage_limits").upsert(
      {
        session_id: sessionId,
        usage_date: date,
        count: next,
      },
      { onConflict: "session_id,usage_date" },
    );

    return next;
  }

  const key = memoryKey(sessionId);
  const next = (memoryUsage.get(key)?.count ?? 0) + 1;
  memoryUsage.set(key, { date, count: next });
  return next;
}

export async function checkAndRecordUsage(sessionId: string): Promise<{
  allowed: boolean;
  used: number;
  limit: number;
}> {
  const limit = getFreeDailyLimit();
  const used = await getCount(sessionId);

  if (used >= limit) {
    return { allowed: false, used, limit };
  }

  const newCount = await incrementCount(sessionId);
  return { allowed: true, used: newCount, limit };
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
