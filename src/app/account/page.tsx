import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/server";
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

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirect=/account");

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle>Your account</CardTitle>
          <CardDescription>Manage your CareerDraft session.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1 text-sm">
            <p>
              <span className="text-muted-foreground">Email: </span>
              {user.email}
            </p>
            <p>
              <span className="text-muted-foreground">User ID: </span>
              <code className="rounded bg-muted px-1 text-xs">{user.id}</code>
            </p>
            {user.created_at && (
              <p>
                <span className="text-muted-foreground">Member since: </span>
                {new Date(user.created_at).toLocaleDateString()}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <ButtonLink href="/pricing">Upgrade plan</ButtonLink>
            <ButtonLink href="/" variant="outline">
              Back to tools
            </ButtonLink>
            <LogoutButton variant="outline" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
