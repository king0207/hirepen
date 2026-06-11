"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { notifyAuthChanged } from "@/lib/auth/client-events";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type LogoutButtonProps = {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
  /** Called immediately after a successful logout (before navigation). */
  onLoggedOut?: () => void;
};

export function LogoutButton({
  variant = "ghost",
  size = "sm",
  className,
  onLoggedOut,
}: LogoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) {
        toast.error("Could not sign out. Please try again.");
        return;
      }
      onLoggedOut?.();
      notifyAuthChanged();
      toast.success("Signed out.");
      router.push("/");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant={variant} size={size} className={className} onClick={handleLogout} disabled={loading}>
      {loading ? <Loader2 className="animate-spin" /> : "Log out"}
    </Button>
  );
}
