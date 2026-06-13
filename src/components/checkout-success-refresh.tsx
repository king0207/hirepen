"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AUTH_CHANGED_EVENT } from "@/lib/auth/client-events";

/** After Creem redirect, refresh server-rendered plan state and client ad flags. */
export function CheckoutSuccessRefresh() {
  const router = useRouter();

  useEffect(() => {
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));

    const timers = [1500, 4000].map((ms) =>
      window.setTimeout(() => {
        router.refresh();
        window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
      }, ms),
    );

    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [router]);

  return null;
}
