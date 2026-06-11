import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { isGithubAuthEnabled, isPasswordAuthEnabled } from "@/lib/env";

export const metadata: Metadata = {
  title: "Log in",
  description: "Sign in to your account, or continue with GitHub.",
  robots: { index: false },
};

const ERROR_MESSAGES: Record<string, string> = {
  github_unavailable: "GitHub login is not available right now.",
  oauth_failed: "GitHub sign-in failed. Please try again.",
  no_email: "Your GitHub account has no public email. Add one or use a password.",
  user_failed: "Could not create your account. Please try again.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const errorMessage = params.error ? ERROR_MESSAGES[params.error] : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      {errorMessage && (
        <div className="mx-auto mb-6 max-w-md rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {errorMessage}
        </div>
      )}
      <Suspense fallback={null}>
        <LoginForm
          passwordEnabled={isPasswordAuthEnabled()}
          githubEnabled={isGithubAuthEnabled()}
        />
      </Suspense>
    </div>
  );
}
