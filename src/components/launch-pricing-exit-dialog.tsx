"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice, launchPricing } from "@/config/pricing";
import { ButtonLink } from "@/components/button-link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const SESSION_KEY = "hirepen_launch_promo_seen";

function promoEnabled(): boolean {
  return process.env.NEXT_PUBLIC_PRICING_LAUNCH_PROMO !== "false";
}

export function LaunchPricingExitDialog() {
  const [open, setOpen] = useState(false);
  const [skipPromo, setSkipPromo] = useState<boolean | null>(null);

  const dismiss = useCallback(() => {
    sessionStorage.setItem(SESSION_KEY, "1");
    setOpen(false);
  }, []);

  const showOnce = useCallback(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    sessionStorage.setItem(SESSION_KEY, "1");
    setOpen(true);
  }, []);

  useEffect(() => {
    if (!promoEnabled()) {
      setSkipPromo(true);
      return;
    }

    fetch("/api/auth/me", { cache: "no-store", credentials: "same-origin" })
      .then((r) => r.json() as Promise<{ user?: { plan?: string } | null }>)
      .then((data) => {
        const plan = data.user?.plan;
        setSkipPromo(plan === "pro" || plan === "lifetime");
      })
      .catch(() => setSkipPromo(false));
  }, []);

  useEffect(() => {
    if (skipPromo !== false) return;

    // Desktop: cursor moves toward tab bar / close button
    function onMouseExitIntent(event: MouseEvent) {
      if (event.clientY > 0) return;
      showOnce();
    }

    document.addEventListener("mouseleave", onMouseExitIntent);

    // Mobile: user taps back to leave right after landing
    const mobile =
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(max-width: 768px)").matches;

    function onBackExit() {
      if (sessionStorage.getItem(SESSION_KEY)) return;
      showOnce();
      history.pushState({ hirepenExitIntent: true }, "");
    }

    if (mobile) {
      history.pushState({ hirepenExitIntent: true }, "");
      window.addEventListener("popstate", onBackExit);
    }

    return () => {
      document.removeEventListener("mouseleave", onMouseExitIntent);
      window.removeEventListener("popstate", onBackExit);
    };
  }, [skipPromo, showOnce]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") dismiss();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, dismiss]);

  if (skipPromo !== false || !open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="launch-promo-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Close"
        onClick={dismiss}
      />
      <div className="relative z-10 w-full max-w-md rounded-xl border border-orange-200 bg-background p-6 shadow-xl">
        <button
          type="button"
          onClick={dismiss}
          className="absolute right-3 top-3 rounded-md p-1 text-muted-foreground hover:bg-muted"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>

        <Badge className="mb-3 bg-orange-600 text-white hover:bg-orange-600">
          Limited-time launch
        </Badge>
        <h2 id="launch-promo-title" className="pr-8 text-xl font-bold tracking-tight">
          Lock in launch pricing before we raise rates
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">{launchPricing.subline}</p>

        <ul className="mt-4 space-y-2 rounded-lg border border-orange-100 bg-orange-50/80 px-3 py-3 text-sm">
          <li className="flex flex-wrap items-baseline gap-2">
            <span className="font-medium">Pro</span>
            <span className="text-muted-foreground line-through">
              {formatPrice(launchPricing.pro.compareAt)}/mo
            </span>
            <span className="font-bold text-orange-700">
              {formatPrice(launchPricing.pro.amount)}/mo
            </span>
          </li>
          <li className="flex flex-wrap items-baseline gap-2">
            <span className="font-medium">Lifetime</span>
            <span className="text-muted-foreground line-through">
              {formatPrice(launchPricing.lifetime.compareAt)}
            </span>
            <span className="font-bold text-orange-700">
              {formatPrice(launchPricing.lifetime.amount)}
            </span>
          </li>
        </ul>

        <p className="mt-3 text-xs text-muted-foreground">{launchPricing.futureNote}</p>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <ButtonLink href="/pricing" className="flex-1" onClick={dismiss}>
            View launch pricing
          </ButtonLink>
          <Button type="button" variant="outline" className="flex-1" onClick={dismiss}>
            Maybe later
          </Button>
        </div>

        <p className="mt-3 text-center text-xs text-muted-foreground">
          <Link href="/pricing" className="underline-offset-4 hover:underline" onClick={dismiss}>
            See all plans →
          </Link>
        </p>
      </div>
    </div>
  );
}
