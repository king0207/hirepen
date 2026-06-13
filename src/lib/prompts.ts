import type { UserPlan } from "@/lib/plans";
import type { Profession } from "@/types/profession";
import type { DocType } from "@/types/profession";

type PromptInput = {
  profession: Profession;
  docType: DocType;
  name: string;
  targetRole: string;
  experience: string;
  skills: string;
  tone: "professional" | "friendly";
  plan?: UserPlan;
};

const US_FORMAT_RULES = `US MARKET FORMAT (mandatory):
- American English spelling only (organize, center, labor, license).
- Dates: "Month YYYY" for employment; cover letters use "Month DD, YYYY" at top when dated.
- Plain text only — no markdown, no code fences, no **bold**, no bullet symbols other than "- " or "• ".
- Do NOT include: photo, age, date of birth, marital status, religion, or Social Security number.
- Resume contact line: name, phone, email, city and state only (no full street address unless user provided one).`;

const ACCURACY_RULES = `ACCURACY (non-negotiable):
- Never invent employers, schools, job titles, dates, licenses, certifications, awards, or metrics.
- Do not add percentages, dollar amounts, or headcount unless the user explicitly provided them.
- If a credential is commonly required but missing, use a bracket placeholder like [BLS Certification] — do not claim the user has it.
- Expand only on facts the user gave; do not infer unrelated experience.`;

const ATS_RULES = `ATS & KEYWORDS:
- Use standard section headings that applicant tracking systems parse easily.
- Weave industry terms naturally into bullets and summary — never keyword-stuff.
- Start experience bullets with strong past-tense action verbs (Managed, Assisted, Documented, Operated).`;

const COVER_LETTER_AVOID = `Avoid these overused openings/closings:
- "I am writing to express my interest..."
- "I believe I would be a great fit..."
- "To whom it may concern" (use "Dear Hiring Manager," instead)
- Generic filler with no tie to the target role.`;

function premiumQualityNote(plan: UserPlan | undefined): string {
  if (plan === "pro" || plan === "lifetime") {
    return `QUALITY TIER: Premium. Be specific, polished, and interview-ready. Every sentence must reflect the user's input or neutral placeholders — no generic template filler.`;
  }
  return "";
}

function buildSystemPrompt(
  profession: Profession,
  docType: DocType,
  plan?: UserPlan,
): string {
  const docLabel = docType === "resume" ? "resume" : "cover letter";
  const keywordHint = profession.keywords.slice(0, 8).join(", ");
  const premium = premiumQualityNote(plan);

  const docRules =
    docType === "resume"
      ? `RESUME RULES:
- Target length: one US page (~350–550 words for entry-level / skilled trades / healthcare support roles).
- Sections (in order): contact header, Professional Summary (2–3 lines), Experience, Skills, Education & Certifications (only if user provided education/certs).
- Experience: reverse chronological. 3–5 bullets per role when user gave enough detail; fewer if input is brief.
- Bullets: lead with action verb + task + outcome when user supplied measurable results.
- Skills: scannable list grouped by category if helpful (Clinical, Technical, Soft Skills).`
      : `COVER LETTER RULES:
- Length: 250–350 words, 3–4 short paragraphs, fits one page.
- Structure: date line → "Dear Hiring Manager," → opening hook naming the role → body (2 paragraphs mapping user experience to role) → closing with confident call to action → "Sincerely," + applicant name.
- Reference the exact target role and 2–3 concrete strengths from the user's background.
- ${COVER_LETTER_AVOID}`;

  return `You are an expert US job application writer specializing in ${profession.jobTitle} roles (${profession.name} sector).

Write a polished, ATS-friendly ${docLabel} for the United States job market. Hiring managers expect direct, confident, factual language — not academic essays or AI-sounding prose.

${US_FORMAT_RULES}

${ACCURACY_RULES}

${ATS_RULES}

Industry context:
- Role family: ${profession.jobTitle}
- Natural phrases to use where accurate: ${profession.samplePhrases.join(", ")}
- Relevant job-search terms (use only when truthful): ${keywordHint}

${docRules}

${premium}`.trim();
}

function buildUserPrompt(input: PromptInput): string {
  const toneNote =
    input.tone === "friendly"
      ? "Tone: warm and approachable, still professional — like a confident candidate in a service or healthcare interview."
      : "Tone: formal and professional — standard US business correspondence.";

  const docLabel = input.docType === "resume" ? "resume" : "cover letter";

  return `Generate a ${docLabel} for this US job application.

Applicant name: ${input.name}
Target role / job title: ${input.targetRole}
Profession page context: ${input.profession.intro.slice(0, 280)}

Experience and background (use as primary source — do not contradict):
${input.experience.trim() || "Not provided — emphasize transferable skills only; do not invent prior jobs."}

Skills (use as provided — do not add skills not listed or clearly implied by experience):
${input.skills.trim() || "Not provided — derive skill bullets only from the experience section above."}

${toneNote}

Output the finished ${docLabel} only — no preamble, no "Here is your resume", no tips after the document.`;
}

/** Suggested generation params by plan and document type. */
export function getGenerationParams(opts: {
  docType: DocType;
  plan?: UserPlan;
}): { temperature: number; maxTokens: number } {
  const isPaid = opts.plan === "pro" || opts.plan === "lifetime";
  const temperature = isPaid ? 0.5 : 0.55;
  const maxTokens =
    opts.docType === "cover_letter" ? (isPaid ? 950 : 850) : isPaid ? 2000 : 1600;
  return { temperature, maxTokens };
}

export function buildMessages(input: PromptInput) {
  return [
    {
      role: "system" as const,
      content: buildSystemPrompt(input.profession, input.docType, input.plan),
    },
    { role: "user" as const, content: buildUserPrompt(input) },
  ];
}
