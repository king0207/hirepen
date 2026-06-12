import nodemailer from "nodemailer";
import type { SmtpConfig } from "@/lib/env";
import { getSmtpConfig } from "@/lib/env";

function createTransport(config: SmtpConfig) {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });
}

export async function sendPasswordResetEmail(params: {
  to: string;
  resetUrl: string;
}): Promise<{ ok: boolean; error?: string }> {
  const config = getSmtpConfig();
  if (!config) {
    return { ok: false, error: "SMTP is not configured." };
  }

  const transport = createTransport(config);

  try {
    await transport.sendMail({
      from: config.from,
      to: params.to,
      subject: "Reset your HirePen password",
      text: [
        "You requested a password reset for your HirePen account.",
        "",
        `Open this link to set a new password (valid for 1 hour):`,
        params.resetUrl,
        "",
        "If you did not request this, you can ignore this email.",
      ].join("\n"),
      html: `
        <p>You requested a password reset for your HirePen account.</p>
        <p><a href="${params.resetUrl}">Reset your password</a></p>
        <p>This link expires in 1 hour.</p>
        <p>If you did not request this, you can ignore this email.</p>
      `,
    });
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[email] sendPasswordResetEmail failed:", message, err);
    return { ok: false, error: message };
  }
}
