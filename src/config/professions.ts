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
  {
    slug: "retail",
    name: "Retail",
    jobTitle: "Retail Sales Associate",
    metaTitle: "Retail Resume No Experience & Sales Associate Resume Generator",
    metaDescription:
      "Build a retail resume with no experience or a sales associate cover letter. Free AI tool for store, mall, and big-box retail jobs.",
    keywords: [
      "retail resume no experience",
      "sales associate resume",
      "retail cover letter",
      "store associate resume",
    ],
    hero: {
      h1: "Retail Resume & Cover Letter Builder",
      subtitle:
        "Create a retail resume that highlights customer service, cash handling, and sales goals — even with no prior retail experience.",
    },
    intro:
      "Retail hiring managers look for friendly customer service, reliability, and the ability to hit sales targets. This tool helps you frame restaurant, volunteer, or school experience as retail-ready skills for stores, malls, and e-commerce fulfillment roles.",
    faqs: [
      {
        question: "How do I write a retail resume with no experience?",
        answer:
          "Lead with customer service, cash handling, teamwork, and any volunteer or school activities that show responsibility and communication skills.",
      },
      {
        question: "What skills should a sales associate resume include?",
        answer:
          "POS systems, upselling, inventory restocking, loss prevention awareness, and meeting daily sales or conversion goals.",
      },
      {
        question: "Do I need a cover letter for retail jobs?",
        answer:
          "Optional for big-box stores, but helpful for specialty retail or management-track roles — keep it short and customer-focused.",
      },
    ],
    samplePhrases: [
      "customer service excellence",
      "POS and cash handling",
      "visual merchandising",
      "sales goal achievement",
    ],
    targetRolePlaceholder: "e.g. Sales Associate — Clothing Store",
    enabled: true,
  },
  {
    slug: "customer-service",
    name: "Customer Service",
    jobTitle: "Customer Service Representative",
    metaTitle: "Customer Service Resume & Cover Letter Generator — Free AI",
    metaDescription:
      "Create a customer service resume or call center cover letter. Highlight phone support, CRM tools, and problem resolution skills.",
    keywords: [
      "customer service resume",
      "call center resume",
      "customer service cover letter",
      "CSR resume no experience",
    ],
    hero: {
      h1: "Customer Service Resume Builder",
      subtitle:
        "Draft a customer service resume or cover letter for call center, chat support, and in-person CSR roles.",
    },
    intro:
      "Customer service roles reward clear communication, patience, and problem-solving. Whether you are applying to a call center, retail support desk, or remote chat team, this generator emphasizes metrics like resolution rate, CSAT, and CRM experience.",
    faqs: [
      {
        question: "What should a customer service resume include?",
        answer:
          "Highlight communication skills, CRM or ticketing systems, average handle time, customer satisfaction scores, and conflict de-escalation examples.",
      },
      {
        question: "Can I apply with no call center experience?",
        answer:
          "Yes. Transfer skills from retail, food service, or any job requiring patience, multitasking, and handling complaints professionally.",
      },
      {
        question: "Should I include metrics on a CSR resume?",
        answer:
          "Yes — numbers like calls handled per day, CSAT scores, or first-contact resolution rate help you stand out.",
      },
    ],
    samplePhrases: [
      "conflict de-escalation",
      "CRM and ticketing systems",
      "first-contact resolution",
      "customer satisfaction (CSAT)",
    ],
    targetRolePlaceholder: "e.g. Customer Service Rep — Remote Call Center",
    enabled: true,
  },
  {
    slug: "cashier",
    name: "Cashier",
    jobTitle: "Cashier",
    metaTitle: "Cashier Resume No Experience & Grocery Store Resume Generator",
    metaDescription:
      "Build a cashier resume with no experience for grocery, retail, and fast-food checkout roles. Free AI resume builder.",
    keywords: [
      "cashier resume no experience",
      "cashier resume",
      "grocery store resume",
      "checkout cashier resume",
    ],
    hero: {
      h1: "Cashier Resume Builder",
      subtitle:
        "Create a cashier resume that shows accuracy, speed, and friendly customer interactions — even as a first-time applicant.",
    },
    intro:
      "Cashier jobs are entry-level friendly but competitive. Employers want accurate cash handling, fast checkout times, and a positive attitude. This tool helps you highlight math skills, POS experience, and reliability from any prior job.",
    faqs: [
      {
        question: "How do I write a cashier resume with no experience?",
        answer:
          "Emphasize math accuracy, attention to detail, customer service from any job, and willingness to work flexible hours including weekends.",
      },
      {
        question: "What skills belong on a grocery store cashier resume?",
        answer:
          "POS operation, cash and card transactions, bagging, loyalty program sign-ups, and maintaining a clean checkout area.",
      },
      {
        question: "Is a cover letter needed for cashier jobs?",
        answer:
          "Usually not required, but a brief note about reliability and availability can help at busy grocery or big-box stores.",
      },
    ],
    samplePhrases: [
      "accurate cash handling",
      "POS transaction processing",
      "high-volume checkout",
      "customer greeting and upselling",
    ],
    targetRolePlaceholder: "e.g. Cashier — Grocery Store",
    enabled: true,
  },
  {
    slug: "barista",
    name: "Barista",
    jobTitle: "Barista",
    metaTitle: "Barista Resume No Experience & Coffee Shop Resume Generator",
    metaDescription:
      "Create a barista resume with no experience or a coffee shop cover letter. Free AI tool for Starbucks, cafes, and specialty coffee roles.",
    keywords: [
      "barista resume no experience",
      "barista resume",
      "coffee shop resume",
      "Starbucks resume",
    ],
    hero: {
      h1: "Barista Resume & Cover Letter Builder",
      subtitle:
        "Generate a barista resume that highlights customer service, drink preparation, and fast-paced teamwork.",
    },
    intro:
      "Coffee shops hire for speed, consistency, and guest experience. Whether you are applying to Starbucks, a local cafe, or a drive-through, this tool frames food service, retail, or volunteer experience as barista-ready skills.",
    faqs: [
      {
        question: "How do I make a barista resume with no experience?",
        answer:
          "Highlight customer service, cash handling, ability to learn recipes quickly, early morning availability, and teamwork in fast-paced environments.",
      },
      {
        question: "What skills do coffee shops look for?",
        answer:
          "Espresso machine basics, milk steaming, POS systems, order accuracy under pressure, and maintaining a clean workspace.",
      },
      {
        question: "Should I mention Starbucks or other brands by name?",
        answer:
          "Use the target role field to specify the cafe or chain you are applying to — the AI will tailor tone accordingly.",
      },
    ],
    samplePhrases: [
      "espresso and drink preparation",
      "drive-through efficiency",
      "POS and mobile orders",
      "peak-hour multitasking",
    ],
    targetRolePlaceholder: "e.g. Barista — Specialty Coffee Shop",
    enabled: true,
  },
  {
    slug: "security-guard",
    name: "Security Guard",
    jobTitle: "Security Officer",
    metaTitle: "Security Guard Resume No Experience & Security Officer Resume",
    metaDescription:
      "Build a security guard resume with no experience. Highlight observation, patrol, and safety compliance for unarmed security roles.",
    keywords: [
      "security guard resume no experience",
      "security guard resume",
      "security officer resume",
      "unarmed security resume",
    ],
    hero: {
      h1: "Security Guard Resume Builder",
      subtitle:
        "Create a security guard resume that emphasizes observation, report writing, and professional conduct.",
    },
    intro:
      "Security roles require alertness, clear communication, and adherence to post orders. This generator helps you highlight military, law enforcement, or customer-facing experience as relevant for unarmed security, concierge, and site patrol positions.",
    faqs: [
      {
        question: "How do I write a security guard resume with no experience?",
        answer:
          "Emphasize reliability, attention to detail, conflict avoidance, physical fitness, and any jobs requiring observation, access control, or incident reporting.",
      },
      {
        question: "What certifications help on a security resume?",
        answer:
          "List state guard card, CPR/First Aid, OSHA awareness, and any specialized training for hospitals, schools, or corporate sites.",
      },
      {
        question: "Do security guards need a cover letter?",
        answer:
          "Optional for entry posts, but useful for corporate or government contracts where professionalism and writing matter.",
      },
    ],
    samplePhrases: [
      "access control and patrol",
      "incident report writing",
      "CCTV monitoring",
      "emergency response procedures",
    ],
    targetRolePlaceholder: "e.g. Unarmed Security Officer — Corporate Campus",
    enabled: true,
  },
  {
    slug: "administrative-assistant",
    name: "Administrative Assistant",
    jobTitle: "Administrative Assistant",
    metaTitle: "Administrative Assistant Resume & Cover Letter Generator",
    metaDescription:
      "Create an administrative assistant resume or office admin cover letter. Highlight scheduling, Microsoft Office, and organization skills.",
    keywords: [
      "administrative assistant resume",
      "admin assistant cover letter",
      "office assistant resume",
      "entry level admin resume",
    ],
    hero: {
      h1: "Administrative Assistant Resume Builder",
      subtitle:
        "Draft an admin assistant resume or cover letter focused on scheduling, correspondence, and office organization.",
    },
    intro:
      "Administrative assistants keep offices running smoothly. Hiring managers look for Microsoft Office proficiency, calendar management, and professional communication. This tool structures your experience for corporate, medical, legal, and nonprofit admin roles.",
    faqs: [
      {
        question: "What should an administrative assistant resume include?",
        answer:
          "List Microsoft Office (Word, Excel, Outlook), calendar management, travel coordination, filing systems, and phone etiquette.",
      },
      {
        question: "How do I write an admin resume with no office experience?",
        answer:
          "Transfer organization, customer service, data entry, and multitasking skills from retail, school projects, or volunteer coordinator roles.",
      },
      {
        question: "Is a cover letter important for admin roles?",
        answer:
          "Yes — admin hiring often values writing quality. A concise cover letter showing professionalism and attention to detail helps.",
      },
    ],
    samplePhrases: [
      "calendar and travel coordination",
      "Microsoft Office Suite",
      "executive correspondence",
      "office supply and inventory management",
    ],
    targetRolePlaceholder: "e.g. Administrative Assistant — Law Firm",
    enabled: true,
  },
  {
    slug: "receptionist",
    name: "Receptionist",
    jobTitle: "Receptionist",
    metaTitle: "Receptionist Resume No Experience & Front Desk Resume Generator",
    metaDescription:
      "Build a receptionist resume with no experience for medical, dental, hotel, and corporate front desk roles. Free AI tool.",
    keywords: [
      "receptionist resume no experience",
      "receptionist resume",
      "front desk resume",
      "medical receptionist resume",
    ],
    hero: {
      h1: "Receptionist Resume & Cover Letter Builder",
      subtitle:
        "Create a receptionist resume that showcases phone etiquette, scheduling, and a professional front-desk presence.",
    },
    intro:
      "Receptionists are the first impression of any business. Employers want friendly communication, multitasking, and scheduling software experience. This generator tailors content for medical, dental, hotel, and corporate front desk applications.",
    faqs: [
      {
        question: "How do I write a receptionist resume with no experience?",
        answer:
          "Highlight customer service, phone skills, professional appearance, data entry, and any volunteer or school front-desk duties.",
      },
      {
        question: "What goes on a medical receptionist resume?",
        answer:
          "Include HIPAA awareness, patient check-in, insurance verification basics, EMR scheduling systems, and calm bedside manner on the phone.",
      },
      {
        question: "Do receptionists need a cover letter?",
        answer:
          "Helpful for medical and corporate roles where professionalism and communication are evaluated from the first contact.",
      },
    ],
    samplePhrases: [
      "multi-line phone systems",
      "patient or guest check-in",
      "appointment scheduling software",
      "professional front-desk presence",
    ],
    targetRolePlaceholder: "e.g. Medical Receptionist — Dental Office",
    enabled: true,
  },
  {
    slug: "caregiver",
    name: "Caregiver",
    jobTitle: "Caregiver / Home Health Aide",
    metaTitle: "Caregiver Resume No Experience & Home Health Aide Resume",
    metaDescription:
      "Create a caregiver resume or home health aide cover letter. Highlight compassion, ADLs, and patient safety for in-home care roles.",
    keywords: [
      "caregiver resume no experience",
      "caregiver resume",
      "home health aide resume",
      "caregiver cover letter",
    ],
    hero: {
      h1: "Caregiver Resume & Cover Letter Builder",
      subtitle:
        "Generate a caregiver resume that emphasizes compassion, reliability, and hands-on support for elderly or disabled clients.",
    },
    intro:
      "Caregiver and home health aide roles require empathy, patience, and practical ADL support. This tool helps you highlight personal care experience, medication reminders, mobility assistance, and companionship for agency or private-duty applications.",
    faqs: [
      {
        question: "How do I write a caregiver resume with no paid experience?",
        answer:
          "Include care for family members, volunteer work, CNA training, CPR certification, and transferable skills like cooking, housekeeping, and transportation.",
      },
      {
        question: "What skills do home health agencies want?",
        answer:
          "ADLs, vital signs, infection control, HIPAA privacy, reliable transportation, and clear communication with families and nurses.",
      },
      {
        question: "Should caregivers include a cover letter?",
        answer:
          "Yes for agency applications — a short letter showing compassion and reliability can differentiate you from other applicants.",
      },
    ],
    samplePhrases: [
      "activities of daily living (ADLs)",
      "medication reminders",
      "mobility and transfer assistance",
      "companionship and meal preparation",
    ],
    targetRolePlaceholder: "e.g. Caregiver — Home Health Agency",
    enabled: true,
  },
  {
    slug: "custodian",
    name: "Custodian",
    jobTitle: "Custodian / Janitor",
    metaTitle: "Janitor Resume No Experience & Custodian Resume Generator",
    metaDescription:
      "Build a janitor or custodian resume with no experience. Highlight cleaning, maintenance, and safety for schools, offices, and hospitals.",
    keywords: [
      "janitor resume no experience",
      "custodian resume",
      "cleaning resume",
      "school custodian resume",
    ],
    hero: {
      h1: "Custodian & Janitor Resume Builder",
      subtitle:
        "Create a custodian resume that shows cleaning expertise, reliability, and safety compliance — even without prior janitorial experience.",
    },
    intro:
      "Custodian and janitor roles require physical stamina, attention to detail, and consistent attendance. Schools, offices, and hospitals hire for floor care, sanitization, and basic maintenance. This tool frames any manual labor or housekeeping experience as relevant.",
    faqs: [
      {
        question: "How do I write a janitor resume with no experience?",
        answer:
          "Emphasize physical stamina, attention to detail, reliability, and any housekeeping, landscaping, or food service cleaning duties.",
      },
      {
        question: "What skills belong on a custodian resume?",
        answer:
          "Floor buffing, restroom sanitization, chemical safety (MSDS), trash removal, and basic light maintenance like changing bulbs or filters.",
      },
      {
        question: "Do custodians need a cover letter?",
        answer:
          "Rarely required, but a brief note about school or hospital experience and background check readiness can help.",
      },
    ],
    samplePhrases: [
      "floor care and sanitization",
      "OSHA chemical safety",
      "restroom and common area maintenance",
      "lock-up and security procedures",
    ],
    targetRolePlaceholder: "e.g. School Custodian — Elementary School",
    enabled: true,
  },
  {
    slug: "forklift-operator",
    name: "Forklift Operator",
    jobTitle: "Forklift Operator",
    metaTitle: "Forklift Operator Resume & Warehouse Forklift Resume Generator",
    metaDescription:
      "Create a forklift operator resume highlighting OSHA certification, loading docks, and inventory movement. Free AI resume builder.",
    keywords: [
      "forklift operator resume",
      "forklift driver resume",
      "warehouse forklift resume",
      "OSHA forklift certification resume",
    ],
    hero: {
      h1: "Forklift Operator Resume Builder",
      subtitle:
        "Generate a forklift operator resume that showcases OSHA certification, safety record, and warehouse productivity.",
    },
    intro:
      "Forklift operators are in high demand at warehouses, manufacturing plants, and distribution centers. Employers require valid certification, safety awareness, and efficient load handling. This tool highlights your equipment types, shift availability, and accident-free record.",
    faqs: [
      {
        question: "What should a forklift operator resume include?",
        answer:
          "List OSHA forklift certification, equipment types (sit-down, stand-up, reach truck), years of experience, and safety record with zero incidents.",
      },
      {
        question: "Can I apply without certification?",
        answer:
          "Mention if certification is in progress or if you have operated equipment under supervision — many employers train on hire.",
      },
      {
        question: "How is this different from a general warehouse resume?",
        answer:
          "This page emphasizes powered industrial truck operation, load stability, and dock safety rather than general picking and packing.",
      },
    ],
    samplePhrases: [
      "OSHA forklift certification",
      "reach truck and sit-down forklift",
      "loading dock safety",
      "inventory staging and put-away",
    ],
    targetRolePlaceholder: "e.g. Forklift Operator — Distribution Center",
    enabled: true,
  },
  {
    slug: "sales-associate",
    name: "Sales Associate",
    jobTitle: "Sales Associate",
    metaTitle: "Sales Associate Resume No Experience & Retail Sales Resume",
    metaDescription:
      "Build a sales associate resume with no experience. Highlight upselling, customer relationships, and sales targets for retail and inside sales.",
    keywords: [
      "sales associate resume no experience",
      "sales associate resume",
      "retail sales resume",
      "entry level sales resume",
    ],
    hero: {
      h1: "Sales Associate Resume Builder",
      subtitle:
        "Create a sales associate resume that demonstrates customer rapport, product knowledge, and consistent sales performance.",
    },
    intro:
      "Sales associate roles span retail floors, car dealerships, electronics stores, and inside sales teams. Hiring managers want persuasion skills, product knowledge, and quota achievement. This generator tailors your experience for commission and non-commission sales environments.",
    faqs: [
      {
        question: "How do I write a sales associate resume with no experience?",
        answer:
          "Highlight persuasion, product enthusiasm, customer service, and any fundraising, school sales, or volunteer activities that show you can close.",
      },
      {
        question: "Should I include sales numbers on my resume?",
        answer:
          "Yes — metrics like daily sales, conversion rate, or average ticket size make your resume much stronger.",
      },
      {
        question: "Do sales associates need cover letters?",
        answer:
          "Useful for higher-ticket retail (electronics, furniture) and any role with commission — show personality and sales drive.",
      },
    ],
    samplePhrases: [
      "upselling and cross-selling",
      "sales quota achievement",
      "product demonstration",
      "client relationship building",
    ],
    targetRolePlaceholder: "e.g. Sales Associate — Electronics Retail",
    enabled: true,
  },
  {
    slug: "fast-food",
    name: "Fast Food",
    jobTitle: "Fast Food Crew Member",
    metaTitle: "Fast Food Resume No Experience & McDonald's Crew Resume Generator",
    metaDescription:
      "Create a fast food resume with no experience for McDonald's, Burger King, Wendy's, and quick-service restaurant jobs. Free AI tool.",
    keywords: [
      "fast food resume no experience",
      "fast food resume",
      "McDonald's resume",
      "crew member resume",
    ],
    hero: {
      h1: "Fast Food Resume & Cover Letter Builder",
      subtitle:
        "Build a fast food crew resume that shows speed, teamwork, and customer service — perfect for first jobs.",
    },
    intro:
      "Fast food restaurants are classic first jobs in the US. Managers hire for reliability, speed during rushes, and friendly service. This tool helps teens and career changers translate any experience into quick-service strengths for drive-through, kitchen, and front counter roles.",
    faqs: [
      {
        question: "How do I write a fast food resume with no work experience?",
        answer:
          "Include school activities, sports teamwork, volunteer work, babysitting, and availability for nights and weekends.",
      },
      {
        question: "What skills do fast food managers want?",
        answer:
          "Speed under pressure, cash handling, food safety basics, teamwork between kitchen and counter, and consistent attendance.",
      },
      {
        question: "Can teenagers use this tool?",
        answer:
          "Yes — enter your age-appropriate experience and the AI drafts a professional one-page resume suitable for quick-service hiring.",
      },
    ],
    samplePhrases: [
      "drive-through order accuracy",
      "food safety and sanitation",
      "rush-hour multitasking",
      "cash register operation",
    ],
    targetRolePlaceholder: "e.g. Crew Member — Quick Service Restaurant",
    enabled: true,
  },
  {
    slug: "medical-assistant",
    name: "Medical Assistant",
    jobTitle: "Medical Assistant",
    metaTitle: "Medical Assistant Resume & Cover Letter Generator — Free AI",
    metaDescription:
      "Create a medical assistant resume or MA cover letter. Highlight clinical skills, vitals, EHR, and patient intake for outpatient clinics.",
    keywords: [
      "medical assistant resume",
      "medical assistant cover letter",
      "MA resume no experience",
      "clinical medical assistant resume",
    ],
    hero: {
      h1: "Medical Assistant Resume & Cover Letter Builder",
      subtitle:
        "Draft a medical assistant resume focused on vitals, patient intake, phlebotomy, and EHR documentation.",
    },
    intro:
      "Medical assistants support physicians in outpatient clinics, urgent care, and specialty practices. Employers look for certification (CMA/RMA), vitals and phlebotomy skills, and HIPAA compliance. This generator structures clinical externships and front-office experience for MA applications.",
    faqs: [
      {
        question: "What should a medical assistant resume include?",
        answer:
          "List MA program, externship hours, vitals, EKG, phlebotomy, EHR systems (Epic, Athena), and HIPAA-trained patient intake.",
      },
      {
        question: "How do I write an MA resume with no experience?",
        answer:
          "Emphasize clinical externship, CPR/BLS, phlebotomy training, and any healthcare or customer service background.",
      },
      {
        question: "Is a cover letter required for medical assistants?",
        answer:
          "Often yes for clinics and specialty practices — a professional letter showing clinical readiness and bedside manner helps.",
      },
    ],
    samplePhrases: [
      "patient vitals and intake",
      "EHR documentation",
      "phlebotomy and specimen handling",
      "HIPAA compliance",
    ],
    targetRolePlaceholder: "e.g. Medical Assistant — Primary Care Clinic",
    enabled: true,
  },
  {
    slug: "phlebotomist",
    name: "Phlebotomist",
    jobTitle: "Phlebotomist",
    metaTitle: "Phlebotomist Resume No Experience & Phlebotomy Resume Generator",
    metaDescription:
      "Build a phlebotomist resume or cover letter. Highlight venipuncture, specimen handling, and patient comfort for lab and hospital roles.",
    keywords: [
      "phlebotomist resume",
      "phlebotomist resume no experience",
      "phlebotomy resume",
      "phlebotomist cover letter",
    ],
    hero: {
      h1: "Phlebotomist Resume & Cover Letter Builder",
      subtitle:
        "Create a phlebotomist resume that showcases venipuncture skills, specimen accuracy, and calm patient interactions.",
    },
    intro:
      "Phlebotomists draw blood in hospitals, labs, and mobile donation units. Hiring managers want certification, accurate labeling, infection control, and a gentle bedside manner. This tool highlights clinical training, successful stick rates, and compliance with lab protocols.",
    faqs: [
      {
        question: "What should a phlebotomist resume include?",
        answer:
          "List phlebotomy certification, venipuncture and capillary techniques, specimen labeling, centrifuge handling, and OSHA safety training.",
      },
      {
        question: "Can I apply as a new phlebotomy graduate?",
        answer:
          "Yes — emphasize clinical rotation hours, successful draws during training, and any healthcare or customer service experience.",
      },
      {
        question: "Do phlebotomists need a cover letter?",
        answer:
          "Recommended for hospital and reference lab roles where accuracy and patient comfort are critical hiring factors.",
      },
    ],
    samplePhrases: [
      "venipuncture and capillary collection",
      "specimen labeling and chain of custody",
      "infection control protocols",
      "patient anxiety management",
    ],
    targetRolePlaceholder: "e.g. Phlebotomist — Outpatient Lab",
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
