export type DocType = "resume" | "cover_letter";

export type ProfessionFaq = {
  question: string;
  answer: string;
};

export type Profession = {
  slug: string;
  name: string;
  jobTitle: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  hero: {
    h1: string;
    subtitle: string;
  };
  intro: string;
  faqs: ProfessionFaq[];
  samplePhrases: string[];
  targetRolePlaceholder: string;
  enabled: boolean;
};

export type GenerateRequest = {
  professionSlug: string;
  docType: DocType;
  name: string;
  targetRole: string;
  experience: string;
  skills: string;
  tone: "professional" | "friendly";
};
