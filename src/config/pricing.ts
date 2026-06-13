/** Display-only pricing copy. Creem checkout amounts must match `amount` fields. */
export const launchPricing = {
  /** Set NEXT_PUBLIC_PRICING_LAUNCH_PROMO=false to hide compare-at / launch messaging. */
  enabled: process.env.NEXT_PUBLIC_PRICING_LAUNCH_PROMO !== "false",
  headline: "Launch pricing — lowest rates we offer",
  subline:
    "Early-user pricing while we grow. Planned regular pricing is shown below — we expect to raise rates after launch.",
  /** Shown as “planned regular price” (strikethrough compare-at on cards). */
  pro: {
    amount: 1.99,
    compareAt: 9.99,
    plannedRegular: 9.99,
    suffix: "/mo" as const,
  },
  lifetime: {
    amount: 29.9,
    compareAt: 49.9,
    plannedRegular: 49.9,
  },
  futureNote:
    "Prices will increase to planned regular rates (Pro $9.99/mo, Lifetime $49.90) once launch pricing ends — no fixed end date yet.",
  lockInNote:
    "Subscribe or buy Lifetime now to keep today’s price. Existing Pro subscriptions stay at the rate you paid unless you cancel.",
};

export function formatPrice(amount: number): string {
  return amount % 1 === 0 ? `$${amount.toFixed(0)}` : `$${amount.toFixed(2)}`;
}
