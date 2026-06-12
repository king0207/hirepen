import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { listGenerations } from "@/lib/data";
import { getPlanLimits, getUserPlan, planLabel } from "@/lib/plans";
import { isPasswordResetEnabled } from "@/lib/env";
import { Badge } from "@/components/ui/badge";
import { ChangePasswordCard } from "@/components/auth/change-password-card";
import { LogoutButton } from "@/components/auth/logout-button";
import { ButtonLink } from "@/components/button-link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Your account",
  robots: { index: false },
};

const DOC_LABEL: Record<string, string> = {
  resume: "Resume",
  cover_letter: "Cover letter",
};

export default async function AccountPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?redirect=/account");

  const [history, plan] = await Promise.all([
    listGenerations({ userId: user.id, limit: 20 }),
    getUserPlan(user.id),
  ]);
  const limits = getPlanLimits();
  const planDetail =
    plan === "pro"
      ? `${limits.monthly} generations per month, no ads`
      : plan === "lifetime"
        ? "Unlimited generations, no ads"
        : `${limits.daily} generations per day (free tier)`;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle>Your account</CardTitle>
          <CardDescription>Manage your HirePen session.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1 text-sm">
            <p>
              <span className="text-muted-foreground">Email: </span>
              {user.email}
            </p>
            <p>
              <span className="text-muted-foreground">Sign-in method: </span>
              {user.provider === "github" ? "GitHub" : "Email & password"}
            </p>
            <p className="flex flex-wrap items-center gap-2">
              <span className="text-muted-foreground">Plan: </span>
              <Badge variant={plan === "free" ? "secondary" : "default"}>
                {planLabel(plan)}
              </Badge>
              <span className="text-muted-foreground">{planDetail}</span>
            </p>
            {user.isAdmin && (
              <p>
                <span className="text-muted-foreground">Role: </span>
                <code className="rounded bg-muted px-1 text-xs">admin</code>
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <ButtonLink href="/pricing">Upgrade plan</ButtonLink>
            <ButtonLink href="/" variant="outline">
              Back to tools
            </ButtonLink>
            {user.isAdmin && (
              <ButtonLink href="/admin" variant="outline">
                Admin dashboard
              </ButtonLink>
            )}
            <LogoutButton variant="outline" />
          </div>
        </CardContent>
      </Card>

      <ChangePasswordCard
        email={user.email}
        provider={user.provider}
        passwordResetEnabled={isPasswordResetEnabled()}
      />

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent generations</CardTitle>
          <CardDescription>Your last {history.length || 0} documents.</CardDescription>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No generations yet. Pick a profession on the home page to get started.
            </p>
          ) : (
            <ul className="divide-y text-sm">
              {history.map((g) => (
                <li key={g.id} className="flex items-center justify-between py-2">
                  <span>
                    <span className="font-medium capitalize">{g.profession_slug}</span>
                    <span className="text-muted-foreground">
                      {" "}
                      · {DOC_LABEL[g.doc_type] ?? g.doc_type}
                    </span>
                  </span>
                  <span className="text-muted-foreground">
                    {new Date(g.created_at).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
