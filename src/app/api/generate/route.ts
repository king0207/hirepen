import { NextRequest } from "next/server";
import { z } from "zod";
import { getProfessionBySlug } from "@/config/professions";
import { streamChat } from "@/lib/ai";
import { buildMessages } from "@/lib/prompts";
import { checkAndRecordUsage, logGeneration } from "@/lib/rate-limit";
import { ensureSessionId } from "@/lib/session";
import { getSessionUser } from "@/lib/auth/session";

const generateSchema = z.object({
  professionSlug: z.string().min(1),
  docType: z.enum(["resume", "cover_letter"]),
  name: z.string().min(1).max(120),
  targetRole: z.string().min(1).max(200),
  experience: z.string().max(8000),
  skills: z.string().max(4000),
  tone: z.enum(["professional", "friendly"]),
});

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = generateSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
  }

  const profession = getProfessionBySlug(parsed.data.professionSlug);
  if (!profession) {
    return Response.json({ error: "Profession not found" }, { status: 404 });
  }

  if (!parsed.data.experience.trim() && !parsed.data.skills.trim()) {
    return Response.json(
      { error: "Provide at least experience or skills." },
      { status: 400 },
    );
  }

  const sessionId = await ensureSessionId();
  const user = await getSessionUser();

  // Admins are exempt from the daily free limit.
  if (!user?.isAdmin) {
    const usage = await checkAndRecordUsage(sessionId);
    if (!usage.allowed) {
      return Response.json(
        {
          error: `Daily free limit reached (${usage.limit}/day). Upgrade on /pricing.`,
          used: usage.used,
          limit: usage.limit,
        },
        { status: 429 },
      );
    }
  }

  const messages = buildMessages({
    profession,
    docType: parsed.data.docType,
    name: parsed.data.name,
    targetRole: parsed.data.targetRole,
    experience: parsed.data.experience,
    skills: parsed.data.skills,
    tone: parsed.data.tone,
  });

  const response = await streamChat(messages);

  if (response.ok) {
    await logGeneration({
      sessionId,
      userId: user?.id ?? null,
      professionSlug: profession.slug,
      docType: parsed.data.docType,
    });
  }

  return response;
}
