"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AUTH_CHANGED_EVENT } from "@/lib/auth/client-events";
import { ButtonLink } from "@/components/button-link";
import { LogoutButton } from "@/components/auth/logout-button";

type MeUser = { email: string; isAdmin: boolean };
type MeResponse = { user: MeUser | null };

export function AuthStatus() {
  const pathname = usePathname();
  const [user, setUser] = useState<MeUser | null | undefined>(undefined);

  const refresh = useCallback(() => {
    fetch("/api/auth/me", { cache: "no-store", credentials: "same-origin" })
      .then((r) => r.json() as Promise<MeResponse>)
      .then((data) => setUser(data.user ?? null))
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    refresh();
  }, [pathname, refresh]);

  useEffect(() => {
    window.addEventListener(AUTH_CHANGED_EVENT, refresh);
    return () => window.removeEventListener(AUTH_CHANGED_EVENT, refresh);
  }, [refresh]);

  // Render nothing until we know the auth state (avoids hydration flicker).
  if (user === undefined) return null;

  if (!user) {
    return (
      <ButtonLink href="/login" variant="ghost" size="sm">
        Log in
      </ButtonLink>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {user.isAdmin && (
        <ButtonLink href="/admin" variant="ghost" size="sm">
          Admin
        </ButtonLink>
      )}
      <ButtonLink href="/account" variant="ghost" size="sm">
        Account
      </ButtonLink>
      <LogoutButton onLoggedOut={() => setUser(null)} />
    </div>
  );
}
