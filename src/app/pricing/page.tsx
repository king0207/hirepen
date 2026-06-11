import type { Metadata } from "next";
import { getCreemStatusNote, PricingTable } from "@/components/pricing-table";

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

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight">Simple pricing</h1>
        <p className="mt-3 text-muted-foreground">
          Start free on any career page. Upgrade when you need more generations or want an ad-free experience.
        </p>
      </div>

      {params.checkout === "success" && (
        <div className="mt-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900">
          Payment received{params.plan ? ` for ${params.plan}` : ""}. Access updates automatically via Creem webhook.
        </div>
      )}

      {creemNote && (
        <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {creemNote}
        </div>
      )}

      <div className="mt-10">
        <PricingTable />
      </div>
    </div>
  );
}
