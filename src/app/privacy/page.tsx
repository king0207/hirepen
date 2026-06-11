import type { Metadata } from "next";
import { SITE_NAME } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy policy for ${SITE_NAME}.`,
};

export default function PrivacyPage() {
  return (
    <article className="prose prose-neutral mx-auto max-w-3xl px-4 py-12 dark:prose-invert">
      <h1>Privacy Policy</h1>
      <p>Last updated: June 10, 2026</p>
      <p>
        {SITE_NAME} (&quot;we&quot;, &quot;us&quot;) respects your privacy. This policy describes how we
        collect and use information when you use our website.
      </p>
      <h2>Information we collect</h2>
      <ul>
        <li>Content you submit to generate resumes or cover letters</li>
        <li>Anonymous session identifiers for usage limits</li>
        <li>Standard server logs and analytics</li>
        <li>Payment-related data processed by Creem (we do not store full card numbers)</li>
      </ul>
      <h2>How we use information</h2>
      <p>
        We use submitted content solely to provide AI generation services, enforce usage limits,
        improve reliability, and process payments. We do not sell personal data.
      </p>
      <h2>Cookies & advertising</h2>
      <p>
        We use cookies for session management. When configured, Google AdSense may use cookies to
        serve ads. See Google&apos;s policies for how ad partners use data.
      </p>
      <h2>Third-party services</h2>
      <ul>
        <li>DeepSeek — AI text generation</li>
        <li>Supabase — database and analytics storage</li>
        <li>Creem — payment processing</li>
        <li>Google AdSense — advertising (free tier)</li>
      </ul>
      <h2>Contact</h2>
      <p>For privacy requests, contact the site operator via your support email once published.</p>
    </article>
  );
}
