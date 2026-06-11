import type { Profession } from "@/types/profession";

/**
 * Add or remove professions here. Set `enabled: false` to hide without deleting.
 * Each enabled profession gets its own SEO landing page at `/{slug}`.
 */
export const professions: Profession[] = [
  {
    slug: "nurse",
    name: "Nurse",
    jobTitle: "Registered Nurse",
    metaTitle:
      "Nursing Cover Letter Generator | New Grad Nurse Resume — Free AI Tool",
    metaDescription:
      "Create a professional nursing cover letter or new grad nurse resume in minutes. Tailored for RN, LPN, and nursing students.",
    keywords: [
      "nursing cover letter",
      "new grad nurse resume",
      "RN resume",
      "LPN cover letter",
    ],
    hero: {
      h1: "AI Nursing Cover Letter & Resume Builder",
      subtitle:
        "Write a nursing cover letter or new grad nurse resume that highlights clinical skills, patient care, and certifications.",
    },
    intro:
      "Whether you are an RN, LPN, or nursing student, this tool helps you draft a US-style nursing cover letter or resume focused on patient care, clinical rotations, and relevant certifications — without starting from a blank page.",
    faqs: [
      {
        question: "How do I write a nursing cover letter with no experience?",
        answer:
          "Focus on clinical rotations, volunteer work, certifications (BLS, ACLS), and transferable skills like communication and teamwork. Our generator structures these for nursing hiring managers.",
      },
      {
        question: "What should a new grad nurse resume include?",
        answer:
          "Include your nursing program, clinical placements, licensure status, certifications, and any healthcare work experience. Keep it one page and use action verbs.",
      },
      {
        question: "Can I use this for LPN and RN applications?",
        answer:
          "Yes. Enter your target role (LPN, RN, or specialty unit) and the AI adapts tone and emphasis for your level.",
      },
    ],
    samplePhrases: [
      "patient-centered care",
      "clinical rotations",
      "medication administration",
      "EMR documentation",
    ],
    targetRolePlaceholder: "e.g. New Grad RN — Med-Surg Unit",
    enabled: true,
  },
  {
    slug: "cna",
    name: "CNA",
    jobTitle: "Certified Nursing Assistant",
    metaTitle: "CNA Resume Example & Cover Letter Generator — Free AI Tool",
    metaDescription:
      "Build a CNA resume example or certified nursing assistant cover letter in minutes. Perfect for first-time CNAs and career changers.",
    keywords: ["CNA resume example", "CNA cover letter", "certified nursing assistant resume"],
    hero: {
      h1: "CNA Resume & Cover Letter Generator",
      subtitle:
        "Create a CNA resume example and cover letter that showcase hands-on patient care, ADLs, and teamwork.",
    },
    intro:
      "Certified Nursing Assistant roles require reliability, compassion, and practical care skills. Generate a CNA-focused resume or cover letter that highlights ADLs, vital signs, and experience in long-term or acute care settings.",
    faqs: [
      {
        question: "What should a CNA resume example include?",
        answer:
          "List your CNA certification, clinical or on-the-job hours, ADL support, vital signs, infection control, and soft skills like empathy and punctuality.",
      },
      {
        question: "Do I need a cover letter as a CNA?",
        answer:
          "Many facilities appreciate a short cover letter showing motivation and fit. Our tool drafts one you can customize.",
      },
      {
        question: "Can I use this with no prior healthcare experience?",
        answer:
          "Yes. Include training hours, externships, volunteer work, and transferable skills from other jobs.",
      },
    ],
    samplePhrases: [
      "activities of daily living",
      "vital signs monitoring",
      "patient mobility assistance",
      "infection control protocols",
    ],
    targetRolePlaceholder: "e.g. CNA — Long-Term Care Facility",
    enabled: true,
  },
  {
    slug: "teacher",
    name: "Teacher",
    jobTitle: "Teacher",
    metaTitle: "Teacher Cover Letter & Resume Generator — Free AI Tool",
    metaDescription:
      "Create a teacher cover letter or substitute teacher resume tailored to your grade level, subject, and classroom experience.",
    keywords: [
      "teacher cover letter",
      "substitute teacher resume",
      "teacher resume",
      "education cover letter",
    ],
    hero: {
      h1: "Teacher Cover Letter & Resume Builder",
      subtitle:
        "Draft a teacher cover letter or resume for full-time, substitute, or first-year teaching roles.",
    },
    intro:
      "From substitute teacher resumes to subject-specific cover letters, this generator emphasizes classroom management, lesson planning, student engagement, and state certification — aligned with US school hiring expectations.",
    faqs: [
      {
        question: "How long should a teacher cover letter be?",
        answer:
          "Aim for one page (3–4 paragraphs): introduction, teaching philosophy or approach, relevant experience, and a closing with enthusiasm for the district or school.",
      },
      {
        question: "What goes on a substitute teacher resume?",
        answer:
          "Highlight flexibility, classroom management, subject familiarity, background checks, and any long-term sub assignments or student teaching.",
      },
      {
        question: "Can new teachers use this tool?",
        answer:
          "Absolutely. Include student teaching, practicum hours, certifications, and relevant volunteer or tutoring experience.",
      },
    ],
    samplePhrases: [
      "differentiated instruction",
      "classroom management",
      "lesson planning",
      "student assessment",
    ],
    targetRolePlaceholder: "e.g. 5th Grade Teacher — Elementary School",
    enabled: true,
  },
  {
    slug: "warehouse",
    name: "Warehouse Worker",
    jobTitle: "Warehouse Associate",
    metaTitle: "Warehouse Resume Generator — No Experience & Entry Level",
    metaDescription:
      "Build a warehouse resume with no experience or highlight forklift, picking, and shipping skills. Free AI warehouse resume builder.",
    keywords: [
      "warehouse resume",
      "warehouse resume no experience",
      "warehouse worker resume",
      "entry level warehouse resume",
    ],
    hero: {
      h1: "Warehouse Resume Builder",
      subtitle:
        "Create a warehouse resume that emphasizes reliability, safety, and physical stamina — even with no direct experience.",
    },
    intro:
      "Warehouse employers look for punctuality, safety awareness, and the ability to meet production goals. This tool helps you frame retail, manual labor, or military experience as relevant for warehouse, fulfillment, and logistics roles.",
    faqs: [
      {
        question: "How do I write a warehouse resume with no experience?",
        answer:
          "Emphasize physical stamina, attention to detail, teamwork, and any jobs involving lifting, inventory, or fast-paced environments.",
      },
      {
        question: "Should I mention forklift certification?",
        answer:
          "Yes — list OSHA forklift certification, RF scanner experience, and WMS systems if you have them.",
      },
      {
        question: "What skills do warehouses want?",
        answer:
          "Picking and packing, loading/unloading, inventory counts, safety compliance, and consistent attendance.",
      },
    ],
    samplePhrases: [
      "order picking and packing",
      "OSHA safety compliance",
      "inventory management",
      "RF scanner operation",
    ],
    targetRolePlaceholder: "e.g. Warehouse Associate — Night Shift",
    enabled: true,
  },
  {
    slug: "driver",
    name: "Driver",
    jobTitle: "Professional Driver",
    metaTitle: "CDL Driver Resume & Delivery Driver Resume Generator",
    metaDescription:
      "Create a CDL driver resume or delivery driver resume with clean driving record, routes, and safety highlights.",
    keywords: [
      "CDL driver resume",
      "delivery driver resume",
      "truck driver resume",
      "driver cover letter",
    ],
    hero: {
      h1: "CDL & Delivery Driver Resume Builder",
      subtitle:
        "Generate a driver resume or cover letter for CDL, delivery, courier, and last-mile roles.",
    },
    intro:
      "Driving roles require a clean record, reliability, and route efficiency. Whether you hold a CDL or drive locally, this tool highlights endorsements, safety record, and on-time delivery metrics.",
    faqs: [
      {
        question: "What should a CDL driver resume include?",
        answer:
          "License class, endorsements (HazMat, tanker), years of experience, equipment types, safety record, and DOT compliance.",
      },
      {
        question: "How do I write a delivery driver resume with no CDL?",
        answer:
          "Focus on local delivery experience, GPS/route efficiency, customer service, vehicle maintenance checks, and a clean MVR.",
      },
      {
        question: "Do drivers need a cover letter?",
        answer:
          "Optional but useful for competitive fleets or logistics companies — keep it brief and safety-focused.",
      },
    ],
    samplePhrases: [
      "clean driving record",
      "DOT compliance",
      "route optimization",
      "on-time delivery",
    ],
    targetRolePlaceholder: "e.g. Class A CDL — Regional OTR",
    enabled: true,
  },
  {
    slug: "server",
    name: "Server",
    jobTitle: "Server / Waiter",
    metaTitle: "Server Resume No Experience & Waiter Resume Generator",
    metaDescription:
      "Build a server resume with no experience or a restaurant cover letter. Free AI tool for waiters, bartenders, and food service.",
    keywords: [
      "server resume no experience",
      "waiter resume",
      "restaurant resume",
      "server cover letter",
    ],
    hero: {
      h1: "Server & Waiter Resume Builder",
      subtitle:
        "Create a server resume with no experience by highlighting customer service, multitasking, and team work.",
    },
    intro:
      "Restaurants hire for attitude, speed, and guest experience. Generate a server or waiter resume that translates retail, hospitality, or volunteer experience into food service strengths.",
    faqs: [
      {
        question: "How do I make a server resume with no experience?",
        answer:
          "Lead with customer service skills, cash handling, fast-paced work, and any hosting, catering, or volunteer food service.",
      },
      {
        question: "What skills belong on a waiter resume?",
        answer:
          "POS systems, upselling, table turnover, teamwork with kitchen staff, and handling guest complaints professionally.",
      },
      {
        question: "Should I include a cover letter for restaurants?",
        answer:
          "For fine dining or management-track roles, a short cover letter can help you stand out.",
      },
    ],
    samplePhrases: [
      "guest satisfaction",
      "POS cash handling",
      "high-volume dining",
      "team coordination",
    ],
    targetRolePlaceholder: "e.g. Server — Casual Dining Restaurant",
    enabled: true,
  },
];

export function getEnabledProfessions(): Profession[] {
  return professions.filter((p) => p.enabled);
}

export function getProfessionBySlug(slug: string): Profession | undefined {
  return professions.find((p) => p.slug === slug && p.enabled);
}

export function getAllProfessionSlugs(): string[] {
  return getEnabledProfessions().map((p) => p.slug);
}
