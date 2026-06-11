"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ButtonLink } from "@/components/button-link";
import { LogoutButton } from "@/components/auth/logout-button";

type MeUser = { email: string; isAdmin: boolean };
type MeResponse = { user: MeUser | null };

export function AuthStatus() {
  const pathname = usePathname();
  const [user, setUser] = useState<MeUser | null | undefined>(undefined);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => r.json() as Promise<MeResponse>)
      .then((data) => {
        if (active) setUser(data.user ?? null);
      })
      .catch(() => {
        if (active) setUser(null);
      });
    return () => {
      active = false;
    };
    // Re-check whenever the route changes (e.g. right after login/logout).
  }, [pathname]);

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
      <LogoutButton />
    </div>
  );
}
