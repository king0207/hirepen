"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { CreemPlan } from "@/lib/creem";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type CreemCheckoutButtonProps = {
  plan: CreemPlan;
  label: string;
  variant?: "default" | "outline" | "secondary";
};

export function CreemCheckoutButton({
  plan,
  label,
  variant = "default",
}: CreemCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const data = (await response.json()) as {
        checkoutUrl?: string;
        error?: string;
        configured?: boolean;
      };

      if (!response.ok) {
        toast.error(data.error || "Checkout unavailable.");
        return;
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }

      toast.error("Checkout URL not returned.");
    } catch {
      toast.error("Could not start checkout.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant={variant} onClick={handleCheckout} disabled={loading}>
      {loading ? (
        <>
          <Loader2 className="animate-spin" />
          Redirecting...
        </>
      ) : (
        label
      )}
    </Button>
  );
}
