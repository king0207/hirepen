import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { isPasswordAuthEnabled, isPasswordResetEnabled } from "@/lib/env";

export const metadata: Metadata = {
  title: "Forgot password",
  robots: { index: false },
};

export default function ForgotPasswordPage() {
  if (!isPasswordAuthEnabled()) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <ForgotPasswordForm smtpConfigured={isPasswordResetEnabled()} />
    </div>
  );
}
