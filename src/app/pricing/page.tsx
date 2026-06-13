import type { Metadata } from "next";
import Link from "next/link";
import { getSessionUser } from "@/lib/auth/session";
import { getUserPlan, planLabel } from "@/lib/plans";
import { getCreemStatusNote, PricingTable } from "@/components/pricing-table";
import { launchPricing } from "@/config/pricing";
import { Badge } from "@/components/ui/badge";
import { CheckoutSuccessRefresh } from "@/components/checkout-success-refresh";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pricing — Pro & Lifetime Plans",
  description:
    "Upgrade for more AI resume and cover letter generations. Free tier available on every career page.",
};

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string; plan?: string }>;
}) {
  const params = await searchParams;
  const creemNote = getCreemStatusNote();
  const user = await getSessionUser();
  const currentPlan = user ? await getUserPlan(user.id) : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {params.checkout === "success" && <CheckoutSuccessRefresh />}

      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight">Simple pricing</h1>
        <p className="mt-3 text-muted-foreground">
          Start free on any career page. Upgrade when you need more generations or want an ad-free experience.
          {launchPricing.enabled && (
            <>
              {" "}
              <span className="font-medium text-foreground">
                Launch rates are our lowest — planned regular pricing is higher and may apply after launch.
              </span>
            </>
          )}
        </p>
      </div>

      {user && currentPlan && (
        <div className="mt-6 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted-foreground">Your current plan:</span>
          <Badge variant={currentPlan === "free" ? "secondary" : "default"}>
            {planLabel(currentPlan)}
          </Badge>
          <Link href="/account" className="text-primary underline-offset-4 hover:underline">
            Account details
          </Link>
        </div>
      )}

      {params.checkout === "success" && (
        <div className="mt-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900">
          Payment received{params.plan ? ` for ${params.plan}` : ""}.
          {currentPlan && currentPlan !== "free" ? (
            <> Your account is now on <strong>{planLabel(currentPlan)}</strong>.</>
          ) : (
            <> Plan access updates within a minute — refresh this page or open Account.</>
          )}
        </div>
      )}

      {creemNote && (
        <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {creemNote}
        </div>
      )}

      <div className="mt-10">
        <PricingTable currentPlan={currentPlan} />
      </div>
    </div>
  );
}
