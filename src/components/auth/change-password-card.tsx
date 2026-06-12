"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

type ChangePasswordCardProps = {
  email: string;
  provider: "password" | "github";
  passwordResetEnabled: boolean;
};

export function ChangePasswordCard({
  email,
  provider,
  passwordResetEnabled,
}: ChangePasswordCardProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changing, setChanging] = useState(false);
  const [sending, setSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  if (provider !== "password") {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>
            You signed in with GitHub. Manage your password in your GitHub account
            settings.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error("Fill in all password fields.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    setChanging(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) {
        toast.error(data.error || "Could not change password.");
        return;
      }
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password updated.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setChanging(false);
    }
  }

  async function handleSendResetEmail() {
    setSending(true);
    try {
      const res = await fetch("/api/auth/request-reset-email", { method: "POST" });
      const data = (await res.json()) as { ok?: boolean; message?: string; error?: string };
      if (!res.ok) {
        toast.error(data.error || "Could not send reset email.");
        return;
      }
      setEmailSent(true);
      toast.success(data.message || "Check your inbox.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Password</CardTitle>
        <CardDescription>
          Change your password with your current password, or receive a reset link by
          email.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="current">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="current">Current password</TabsTrigger>
            <TabsTrigger value="email">Email reset</TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="mt-4">
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm new password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
              <Button type="submit" disabled={changing}>
                {changing ? <Loader2 className="animate-spin" /> : "Update password"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="email" className="mt-4 space-y-4">
            {passwordResetEnabled ? (
              emailSent ? (
                <p className="text-sm text-muted-foreground">
                  We sent a reset link to <span className="font-medium">{email}</span>.
                  Check your inbox and spam folder. The link expires in 1 hour.
                </p>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    We will email a reset link to{" "}
                    <span className="font-medium">{email}</span>. Use it to set a new
                    password without entering your current one.
                  </p>
                  <Button type="button" onClick={handleSendResetEmail} disabled={sending}>
                    {sending ? <Loader2 className="animate-spin" /> : "Send reset link"}
                  </Button>
                </>
              )
            ) : (
              <p className="text-sm text-muted-foreground">
                Email reset is not configured on this server (SMTP missing). Use the
                current password tab, or ask the site admin to enable SMTP.
              </p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
