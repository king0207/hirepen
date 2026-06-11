"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { ButtonLink } from "@/components/button-link";
import { LogoutButton } from "@/components/auth/logout-button";

export function AuthStatus() {
  const [email, setEmail] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setEmail(null);
      return;
    }

    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Hide entirely until we know auth state (and when Supabase is not configured).
  if (email === undefined) return null;

  if (!email) {
    return (
      <ButtonLink href="/login" variant="ghost" size="sm">
        Log in
      </ButtonLink>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <ButtonLink href="/account" variant="ghost" size="sm">
        Account
      </ButtonLink>
      <LogoutButton />
    </div>
  );
}
