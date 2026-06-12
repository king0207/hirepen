import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { isPasswordAuthEnabled } from "@/lib/env";

export const metadata: Metadata = {
  title: "Reset password",
  robots: { index: false },
};

function ResetPasswordInner({ token }: { token: string }) {
  return <ResetPasswordForm token={token} />;
}

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  if (!isPasswordAuthEnabled()) {
    redirect("/login");
  }

  const params = await searchParams;
  const token = params.token?.trim() ?? "";

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <Suspense fallback={null}>
        <ResetPasswordInner token={token} />
      </Suspense>
    </div>
  );
}
