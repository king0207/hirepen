import { getSupportEmail } from "@/config/site";

export function LegalContact() {
  const email = getSupportEmail();
  if (!email) {
    return <p>Support email is shown in the site footer when configured.</p>;
  }

  return <p>For questions, contact us at {email}.</p>;
}
