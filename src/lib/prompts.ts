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
};

function buildSystemPrompt(profession: Profession, docType: DocType): string {
  const docLabel = docType === "resume" ? "resume" : "cover letter";
  return `You are an expert US job application writer specializing in ${profession.jobTitle} roles.

Write a polished, ATS-friendly ${docLabel} in American English for the US job market.
Use clear section headings, bullet points where appropriate, and action verbs.
Incorporate industry-relevant terms such as: ${profession.samplePhrases.join(", ")}.
Do not invent employers, degrees, licenses, or certifications the user did not provide.
If information is missing, use neutral placeholders like [Certification] rather than fabricating details.
Output plain text only — no markdown code fences.`;
}

function buildUserPrompt(input: PromptInput): string {
  const toneNote =
    input.tone === "friendly"
      ? "Use a warm, approachable tone while staying professional."
      : "Use a formal, professional tone.";

  const docInstructions =
    input.docType === "resume"
      ? "Structure: Contact header, Professional Summary, Experience, Skills, Education/Certifications (if provided)."
      : "Structure: Date, hiring manager greeting, opening paragraph, body highlighting fit, closing with call to action. One page max.";

  return `Create a ${input.docType === "resume" ? "resume" : "cover letter"} for a ${input.profession.jobTitle} position.

Applicant name: ${input.name}
Target role: ${input.targetRole}
Experience and background:
${input.experience || "Not provided — emphasize transferable skills."}

Skills:
${input.skills || "Not provided — infer reasonable skills from experience only."}

${docInstructions}
${toneNote}`;
}

export function buildMessages(input: PromptInput) {
  return [
    { role: "system" as const, content: buildSystemPrompt(input.profession, input.docType) },
    { role: "user" as const, content: buildUserPrompt(input) },
  ];
}
