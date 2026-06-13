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
- Employment dates on resumes: "Month YYYY" (e.g. January 2024 – May 2024).
- Cover letter date line: use the "Today's date" given in the user message exactly (Month DD, YYYY).
- Plain text only — no markdown, no code fences, no **bold**, no bullet symbols other than "- " or "• ".
- Do NOT include: photo, age, date of birth, marital status, religion, or Social Security number.
- Resume header: applicant name only, unless phone/email/city/state appear verbatim in the user's input — never invent contact details.
- Cover letter sign-off: "Sincerely," then the applicant name only — no phone, email, city, or state line unless the user explicitly provided them in Experience, Skills, or Target role text.`;

const ACCURACY_RULES = `ACCURACY (non-negotiable):
- Never invent employers, schools, job titles, dates, licenses, certifications, awards, phone numbers, emails, cities, states, or metrics.
- Do not add percentages, dollar amounts, or headcount unless the user explicitly provided them.
- If a credential is commonly required but missing, use a bracket placeholder like [BLS Certification] — do not claim the user has it.
- Expand only on facts the user gave; do not infer unrelated experience.
- Do not add placeholder contact info such as (555) 123-4567 or example@email.com.`;

const ATS_RULES = `ATS & KEYWORDS:
- Use standard section headings that applicant tracking systems parse easily.
- Weave industry terms naturally into bullets and summary — never keyword-stuff.
- Start experience bullets with strong past-tense action verbs (Managed, Assisted, Documented, Operated).`;

const COVER_LETTER_OPENING = `COVER LETTER OPENING (strict):
- The first sentence after "Dear Hiring Manager," must name the target role and one concrete detail from the user's experience (employer, hours, unit, certification, or skill).
- NEVER open with or include these phrases anywhere in the letter:
  "I am writing to express"
  "I am excited to apply"
  "strong interest"
  "great fit"
  "perfect candidate"
  "To whom it may concern"
- Prefer direct openings, e.g. "As a recent nursing graduate with 120 hours of Med-Surg clinical experience at City Hospital, I am ready to contribute to your New Grad RN team."`;

const COVER_LETTER_AVOID = `Also avoid hollow filler unless tied to user facts:
- "interdisciplinary teams", "evidence-informed practice", "evidence-based practices", "high-quality patient outcomes", "dedication to excellence", "passion for healthcare", "I am eager to bring my dedication"
- Generic praise of the employer with no link to the applicant's background.
- Closing paragraph longer than 2 sentences — end with a brief, confident thank-you.`;

function formatLetterDate(): string {
  return new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "America/New_York",
  });
}

function premiumQualityNote(plan: UserPlan | undefined): string {
  if (plan === "pro" || plan === "lifetime") {
    return `QUALITY TIER: Premium (paid). Write like a strong US job applicant — specific, natural, interview-ready.
- Every paragraph must cite at least one fact from the user's input.
- No template language, no AI-sounding abstractions, no invented contact lines.
- Opening hook + concrete clinical/work examples in the body; confident but not boastful close.`;
  }
  return `QUALITY TIER: Standard. Follow all rules above; keep language clear and factual.`;
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
      ? `RESUME RULES (not a cover letter — no "Dear Hiring Manager", no paragraphs of prose):
- Target length: one US page (~350–550 words for entry-level / skilled trades / healthcare support roles).
- Sections (in order): name header, Professional Summary (2–3 lines), Experience, Skills, Education & Certifications (only if user provided education/certs).
- Experience: use clear role/employer labels; bullet list with "- " prefixes; reverse chronological when multiple roles exist.
- 3–5 bullets per role when user gave enough detail; fewer if input is brief.
- Bullets: action verb + what they did + context from user input — no essay sentences.
- Skills: scannable list (comma-separated or short bullets), grouped if helpful (Clinical, Technical, Soft Skills).`
      : `COVER LETTER RULES:
- Length: 250–350 words, 3–4 short paragraphs, fits one page.
- Structure: date line → "Dear Hiring Manager," → opening hook → body (2 paragraphs) → closing → "Sincerely," + applicant name only (no contact block unless user provided phone/email/location in their input).
- Reference the exact target role and 2–3 concrete strengths from the user's background.
- ${COVER_LETTER_OPENING}
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
  const dateLine =
    input.docType === "cover_letter"
      ? `Today's date (use as the first line of the cover letter): ${formatLetterDate()}\n`
      : "";

  return `Generate a ${docLabel} for this US job application.

${dateLine}Applicant name (use exactly for sign-off / resume header): ${input.name}
Target role / job title: ${input.targetRole}
Profession page context: ${input.profession.intro.slice(0, 280)}

Experience and background (use as primary source — do not contradict):
${input.experience.trim() || "Not provided — emphasize transferable skills only; do not invent prior jobs."}

Skills (use as provided — do not add skills not listed or clearly implied by experience):
${input.skills.trim() || "Not provided — derive skill bullets only from the experience section above."}

Contact rule: The user did NOT provide a separate phone, email, or address field. Include phone/email/city/state ONLY if they appear verbatim above in Experience, Skills, or Target role. Otherwise end the cover letter with "Sincerely," and the applicant name only.

${toneNote}

Output the finished ${docLabel} only — no preamble, no "Here is your resume", no tips after the document.`;
}

/** Suggested generation params by plan and document type. */
export function getGenerationParams(opts: {
  docType: DocType;
  plan?: UserPlan;
}): { temperature: number; maxTokens: number } {
  const isPaid = opts.plan === "pro" || opts.plan === "lifetime";
  const temperature = isPaid ? 0.45 : 0.55;
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
