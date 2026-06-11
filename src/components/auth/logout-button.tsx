"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type LogoutButtonProps = {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
};

export function LogoutButton({
  variant = "ghost",
  size = "sm",
  className,
}: LogoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      setLoading(false);
    }
    toast.success("Signed out.");
    router.push("/");
    router.refresh();
  }

  return (
    <Button variant={variant} size={size} className={className} onClick={handleLogout} disabled={loading}>
      {loading ? <Loader2 className="animate-spin" /> : "Log out"}
    </Button>
  );
}
