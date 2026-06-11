"use client";

import { useEffect, useState } from "react";
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
import { Separator } from "@/components/ui/separator";
import { Loader2, RotateCw } from "lucide-react";

type LoginFormProps = {
  passwordEnabled: boolean;
  githubEnabled: boolean;
};

export function LoginForm({ passwordEnabled, githubEnabled }: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState("");
  // Start at a stable value so SSR and the first client render match; the real
  // cache-busting timestamp is set after mount to avoid a hydration mismatch.
  const [captchaKey, setCaptchaKey] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCaptchaKey(Date.now());
  }, []);

  function refreshCaptcha() {
    setCaptcha("");
    setCaptchaKey(Date.now());
  }

  function done() {
    router.push(redirectTo);
    router.refresh();
  }

  async function submit(endpoint: "login" | "register") {
    if (!email || !password) {
      toast.error("Enter email and password.");
      return;
    }
    if (!captcha) {
      toast.error("Enter the captcha.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password, captcha }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) {
        toast.error(data.error || "Login failed.");
        refreshCaptcha();
        return;
      }
      toast.success(endpoint === "register" ? "Account created." : "Signed in.");
      done();
    } catch {
      toast.error("Something went wrong. Please try again.");
      refreshCaptcha();
    } finally {
      setLoading(false);
    }
  }

  async function handleGithub() {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      toast.error("GitHub login is not configured.");
      return;
    }
    const redirect = `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: redirect },
    });
    if (error) toast.error(error.message);
  }

  if (!passwordEnabled && !githubEnabled) {
    return (
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle>Login unavailable</CardTitle>
          <CardDescription>
            Auth is not configured. Set AUTH_SESSION_SECRET and Supabase keys to enable login.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>Sign in to HirePen</CardTitle>
        <CardDescription>Use your account, or continue with GitHub.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {passwordEnabled && (
          <>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
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
                placeholder="At least 8 characters"
                autoComplete="current-password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="captcha">Captcha</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="captcha"
                  value={captcha}
                  onChange={(e) => setCaptcha(e.target.value)}
                  placeholder="Enter the code"
                  autoComplete="off"
                  className="flex-1"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/api/captcha?k=${captchaKey}`}
                  alt="captcha"
                  width={140}
                  height={48}
                  className="cursor-pointer rounded border bg-white"
                  onClick={refreshCaptcha}
                  title="Click to refresh"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={refreshCaptcha}
                  aria-label="Refresh captcha"
                >
                  <RotateCw />
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => submit("login")} disabled={loading} className="flex-1">
                {loading ? <Loader2 className="animate-spin" /> : "Sign in"}
              </Button>
              <Button
                onClick={() => submit("register")}
                disabled={loading}
                variant="outline"
                className="flex-1"
              >
                Sign up
              </Button>
            </div>
          </>
        )}

        {passwordEnabled && githubEnabled && (
          <div className="relative py-1">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
              or
            </span>
          </div>
        )}

        {githubEnabled && (
          <Button variant="outline" className="w-full" onClick={handleGithub} disabled={loading}>
            Continue with GitHub
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
