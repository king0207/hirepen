"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
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

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/account";

  const supabase = createSupabaseBrowserClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!supabase) {
    return (
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle>Login unavailable</CardTitle>
          <CardDescription>
            Supabase is not configured yet. Set NEXT_PUBLIC_SUPABASE_URL and
            NEXT_PUBLIC_SUPABASE_ANON_KEY to enable accounts.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  function done() {
    router.push(redirectTo);
    router.refresh();
  }

  async function handlePasswordSignIn() {
    if (!email || !password) {
      toast.error("Enter email and password.");
      return;
    }
    setLoading(true);
    const { error } = await supabase!.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Signed in.");
    done();
  }

  async function handleSignUp() {
    if (!email || password.length < 6) {
      toast.error("Email required and password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    const { data, error } = await supabase!.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (data.session) {
      toast.success("Account created.");
      done();
    } else {
      toast.success("Account created. Check your email to confirm, then sign in.");
    }
  }

  async function handleSendCode() {
    if (!email) {
      toast.error("Enter your email.");
      return;
    }
    setLoading(true);
    const { error } = await supabase!.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setCodeSent(true);
    toast.success("Verification code sent to your email.");
  }

  async function handleVerifyCode() {
    if (!code) {
      toast.error("Enter the code from your email.");
      return;
    }
    setLoading(true);
    const { error } = await supabase!.auth.verifyOtp({
      email,
      token: code.trim(),
      type: "email",
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Signed in.");
    done();
  }

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>Sign in to {`CareerDraft`}</CardTitle>
        <CardDescription>Use a password or a one-time email code.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="password">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="code">Email code</TabsTrigger>
          </TabsList>

          <TabsContent value="password" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email-pw">Email</Label>
              <Input
                id="email-pw"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handlePasswordSignIn} disabled={loading} className="flex-1">
                {loading ? <Loader2 className="animate-spin" /> : "Sign in"}
              </Button>
              <Button
                onClick={handleSignUp}
                disabled={loading}
                variant="outline"
                className="flex-1"
              >
                Sign up
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="code" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email-code">Email</Label>
              <Input
                id="email-code"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                disabled={codeSent}
              />
            </div>

            {!codeSent ? (
              <Button onClick={handleSendCode} disabled={loading} className="w-full">
                {loading ? <Loader2 className="animate-spin" /> : "Send code"}
              </Button>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="code">Verification code</Label>
                  <Input
                    id="code"
                    inputMode="numeric"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="6-digit code"
                    autoComplete="one-time-code"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleVerifyCode} disabled={loading} className="flex-1">
                    {loading ? <Loader2 className="animate-spin" /> : "Verify & sign in"}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setCodeSent(false);
                      setCode("");
                    }}
                    disabled={loading}
                  >
                    Change email
                  </Button>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
