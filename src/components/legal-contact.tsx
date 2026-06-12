import { getSupportEmail } from "@/config/site";

export function LegalContact() {
  const email = getSupportEmail();
  if (!email) {
    return <p>Support email is shown in the site footer when configured.</p>;
  }

  return (
    <p>
      For questions, contact us at{" "}
      <a href={`mailto:${email}`} className="text-primary underline-offset-4 hover:underline">
        {email}
      </a>
      .
    </p>
  );
}
