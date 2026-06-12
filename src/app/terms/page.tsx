import type { Metadata } from "next";
import { LegalContact } from "@/components/legal-contact";
import { SITE_NAME } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms of service for ${SITE_NAME}.`,
};

export default function TermsPage() {
  return (
    <article className="prose prose-neutral mx-auto max-w-3xl px-4 py-12 dark:prose-invert">
      <h1>Terms of Service</h1>
      <p>Last updated: June 10, 2026</p>
      <p>
        By using {SITE_NAME}, you agree to these terms. If you do not agree, do not use the service.
      </p>
      <h2>Service description</h2>
      <p>
        We provide AI-assisted drafts of resumes and cover letters for job seekers. Output is for
        informational purposes; you are responsible for reviewing accuracy before submitting to employers.
      </p>
      <h2>Acceptable use</h2>
      <ul>
        <li>Do not submit false credentials or impersonate others</li>
        <li>Do not abuse API limits or attempt to reverse engineer the service</li>
        <li>Do not use the service for unlawful purposes</li>
      </ul>
      <h2>Payments & refunds</h2>
      <p>
        Paid plans are processed by Creem. Refund policies follow Creem and product-specific rules
        displayed at checkout.
      </p>
      <h2>Disclaimer</h2>
      <p>
        The service is provided &quot;as is&quot; without warranties. We are not responsible for hiring
        outcomes or errors in AI-generated content you choose to use.
      </p>
      <h2>Changes</h2>
      <p>We may update these terms. Continued use after changes constitutes acceptance.</p>
      <h2>Contact</h2>
      <LegalContact />
    </article>
  );
}
