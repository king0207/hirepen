import type { DocType } from "@/types/profession";

type SanitizeInput = {
  text: string;
  docType: DocType;
  name: string;
  experience: string;
  skills: string;
  targetRole: string;
};

function userSource(input: SanitizeInput): string {
  return `${input.experience} ${input.skills} ${input.targetRole}`.toLowerCase();
}

function sourceIncludes(source: string, ...needles: string[]): boolean {
  return needles.some((n) => source.includes(n.toLowerCase()));
}

function userProvidedContact(source: string): boolean {
  return (
    /[\w.+-]+@[\w.-]+\.[a-z]{2,}/i.test(source) ||
    /\(\d{3}\)\s*\d{3}[-\s]?\d{4}/.test(source) ||
    /\d{3}-\d{3}-\d{4}/.test(source)
  );
}

function normalizeSignOff(text: string, name: string): string {
  const trimmedName = name.trim();
  if (!trimmedName) return text;

  const escaped = trimmedName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // "Sincerely,\nJane Smith  Jane Smith" → single name
  text = text.replace(
    new RegExp(`(Sincerely,?\\s*\\n\\s*)${escaped}(?:\\s+${escaped})+`, "gi"),
    `$1${trimmedName}`,
  );

  return text;
}

/** Cover letter followed by resume sections in one blob. */
function truncateAtResumeSection(text: string): string {
  const markers = [/\nProfessional Summary\s*\n/i, /\nExperience\s*\n/i];
  let cutAt = text.length;

  for (const marker of markers) {
    const match = text.match(marker);
    if (match?.index !== undefined && match.index < cutAt) {
      cutAt = match.index;
    }
  }

  return cutAt < text.length ? text.slice(0, cutAt).trimEnd() : text;
}

/** Resume prefixed with a full cover letter. */
function stripCoverLetterPrefix(text: string, name: string): string {
  const summaryMatch = text.match(/\nProfessional Summary\s*\n/i);
  if (!summaryMatch || summaryMatch.index === undefined) return text;

  const prefix = text.slice(0, summaryMatch.index);
  if (!/Dear Hiring Manager,/i.test(prefix)) return text;

  let resume = text.slice(summaryMatch.index + 1).trimStart();
  if (!resume.toLowerCase().startsWith(name.trim().toLowerCase())) {
    resume = `${name.trim()}\n\n${resume}`;
  }
  return resume;
}

function stripSincerelyFromResume(text: string): string {
  return text.replace(/\n\s*Sincerely,?\s*\r?\n[^\n]+\s*$/i, "").trimEnd();
}

function stripLeadingCoverLetterFromResume(text: string, name: string): string {
  if (!/^[^\n]*\n\s*Dear Hiring Manager,/i.test(text) && !/^Dear Hiring Manager,/i.test(text)) {
    return stripCoverLetterPrefix(text, name);
  }

  const summaryIdx = text.search(/\nProfessional Summary\s*\n/i);
  if (summaryIdx >= 0) {
    let resume = text.slice(summaryIdx + 1).trimStart();
    if (!resume.toLowerCase().startsWith(name.trim().toLowerCase())) {
      resume = `${name.trim()}\n\n${resume}`;
    }
    return resume;
  }

  return text;
}

function fixCoverLetterOpening(text: string, targetRole: string): string {
  let output = text;
  const replacements: Array<[RegExp, string]> = [
    [
      /Dear Hiring Manager,\s*\n+\s*I am writing to express my strong interest in the ([^.]+)\.\s*/gi,
      "Dear Hiring Manager,\n\nAs a candidate for the $1, ",
    ],
    [
      /Dear Hiring Manager,\s*\n+\s*I am writing to express my interest in the ([^.]+)\.\s*/gi,
      "Dear Hiring Manager,\n\nAs a candidate for the $1, ",
    ],
    [
      /Dear Hiring Manager,\s*\n+\s*I am excited to apply for the ([^.]+)\.\s*/gi,
      "Dear Hiring Manager,\n\nI am applying for the $1, ",
    ],
  ];

  for (const [pattern, replacement] of replacements) {
    output = output.replace(pattern, replacement);
  }

  if (/strong interest/i.test(output.split("\n\n")[1] ?? "")) {
    const role = targetRole.trim() || "this position";
    output = output.replace(
      /(Dear Hiring Manager,\s*\n+\s*)([^\n]+)/i,
      `$1With hands-on training relevant to the ${role}, $2`,
    );
  }

  return output;
}

function stripInventedContactBlock(text: string): string {
  const lines = text.split(/\r?\n/);
  const sincerelyIndex = lines.findIndex((line) => /^Sincerely,?\s*$/i.test(line.trim()));
  if (sincerelyIndex < 0) return text;

  const nameIndex = sincerelyIndex + 1;
  const contactPattern =
    /@|\(\d{3}\)|\d{3}-\d{3}-\d{4}|\|\s*[A-Za-z .,'-]+,\s*[A-Z]{2}\s*$|@email\.|janesmith@/i;

  const trimmed: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (i > nameIndex && contactPattern.test(lines[i])) continue;
    if (i === nameIndex && contactPattern.test(lines[i])) continue;
    trimmed.push(lines[i]);
  }

  return trimmed.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd();
}

function stripResumeFabrication(text: string, source: string): string {
  let output = text;

  // Model sometimes appends a cover letter after the resume.
  const dearIndex = output.search(/\nDear Hiring Manager,/i);
  if (dearIndex >= 0) {
    output = output.slice(0, dearIndex).trimEnd();
  }

  const lines = output.split(/\r?\n/);
  const filtered: string[] = [];
  let inEducation = false;

  const hasSchool =
    sourceIncludes(source, "university", "college", "school", "degree", "graduat", "adn", "bsn", "msn", "diploma") ||
    /\b(19|20)\d{2}\b/.test(source) && sourceIncludes(source, "grad");

  for (const line of lines) {
    const trimmed = line.trim();

    if (/^education/i.test(trimmed)) {
      inEducation = !hasSchool ? false : true;
      if (hasSchool) filtered.push(line);
      continue;
    }

    if (inEducation && !hasSchool) continue;

    if (
      !hasSchool &&
      (/associate degree|bachelor|master|\[institution name\]|expected graduation|diploma in nursing/i.test(trimmed) ||
        /^education & certifications?/i.test(trimmed))
    ) {
      inEducation = false;
      continue;
    }

    if (
      !sourceIncludes(source, "valid through", "expires", "expiry") &&
      /valid through|expires:?/i.test(trimmed)
    ) {
      continue;
    }

    if (
      /^(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{4}\s*[–-]/i.test(
        trimmed,
      ) &&
      !sourceIncludes(
        source,
        trimmed.slice(0, 3).toLowerCase(),
        trimmed.match(/\d{4}/)?.[0] ?? "",
      )
    ) {
      continue;
    }

    if (/\[institution name\]|\[city, state\]/i.test(trimmed)) continue;

    filtered.push(line);
  }

  output = filtered.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd();

  // If BLS mentioned but line was over-specified, simplify to plain BLS line when needed.
  if (sourceIncludes(source, "bls") && !sourceIncludes(source, "american heart", "aha")) {
    output = output.replace(
      /BLS Certification[^\n]*American Heart Association[^\n]*/gi,
      "BLS Certified",
    );
    output = output.replace(/BLS Certification[^\n]*Valid through[^\n]*/gi, "BLS Certified");
  }

  return output;
}

function sanitizeCoverLetter(input: SanitizeInput): string {
  let text = truncateAtResumeSection(input.text);
  text = fixCoverLetterOpening(text, input.targetRole);
  if (!userProvidedContact(userSource(input))) {
    text = stripInventedContactBlock(text);
  }
  text = normalizeSignOff(text, input.name);
  return text.trimEnd();
}

function sanitizeResume(input: SanitizeInput): string {
  let text = stripLeadingCoverLetterFromResume(input.text, input.name);
  text = stripResumeFabrication(text, userSource(input));
  text = stripSincerelyFromResume(text);
  return text.trimEnd();
}

/** Post-process model output to fix common resume/cover letter mistakes. */
export function sanitizeGeneratedOutput(input: SanitizeInput): string {
  if (!input.text.trim()) return input.text;

  if (input.docType === "cover_letter") {
    return sanitizeCoverLetter(input);
  }

  return sanitizeResume(input);
}
