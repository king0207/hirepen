import { ButtonLink } from "@/components/button-link";
import { formatPrice, launchPricing } from "@/config/pricing";
import {
  getCreemConfig,
  getCreemProductId,
  getFreeDailyLimit,
  isCreemEnabled,
} from "@/lib/env";
import type { UserPlan } from "@/lib/plans";
import { CreemCheckoutButton } from "@/components/creem-checkout-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type PricingTableProps = {
  currentPlan?: UserPlan | null;
};

function ComparePrice({
  amount,
  compareAt,
  suffix,
}: {
  amount: number;
  compareAt?: number;
  suffix?: string;
}) {
  const showCompare = launchPricing.enabled && compareAt && compareAt > amount;

  return (
    <div className="space-y-1">
      {showCompare && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted-foreground line-through">{formatPrice(compareAt)}</span>
          <Badge variant="secondary" className="border-orange-300 bg-orange-100 text-orange-900">
            Launch deal
          </Badge>
        </div>
      )}
      <p className="text-3xl font-bold">
        {formatPrice(amount)}
        {suffix && <span className="text-base font-normal">{suffix}</span>}
      </p>
      {showCompare && (
        <p className="text-xs font-medium text-green-700">Current lowest price</p>
      )}
    </div>
  );
}

export function PricingTable({ currentPlan = null }: PricingTableProps) {
  const freeLimit = getFreeDailyLimit();
  const creemEnabled = isCreemEnabled();
  const proConfigured = Boolean(getCreemProductId("pro"));
  const lifetimeConfigured = Boolean(getCreemProductId("lifetime"));

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {launchPricing.enabled && (
        <div className="md:col-span-3 space-y-3 rounded-lg border border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 px-4 py-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-orange-600 text-white hover:bg-orange-600">Limited-time launch</Badge>
            <p className="text-sm font-medium text-orange-950">{launchPricing.headline}</p>
          </div>
          <p className="text-sm text-orange-900/90">{launchPricing.subline}</p>
          <ul className="list-inside list-disc space-y-1 text-sm text-orange-950/85">
            <li>
              Pro: {formatPrice(launchPricing.pro.amount)}/mo now — planned regular{" "}
              {formatPrice(launchPricing.pro.plannedRegular)}/mo
            </li>
            <li>
              Lifetime: {formatPrice(launchPricing.lifetime.amount)} now — planned regular{" "}
              {formatPrice(launchPricing.lifetime.plannedRegular)}
            </li>
          </ul>
          <p className="text-sm font-medium text-orange-950">{launchPricing.futureNote}</p>
          <p className="text-xs text-orange-900/75">{launchPricing.lockInNote}</p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Free</CardTitle>
          <CardDescription>For trying the generator</CardDescription>
          <p className="text-3xl font-bold">$0</p>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>{freeLimit} generations per day</p>
          <p>All career pages included</p>
          <p>Ads on free tier</p>
          <p>Copy & .txt download</p>
        </CardContent>
        <CardFooter>
          <ButtonLink href="/nurse" variant="outline" className="w-full">
            Start free
          </ButtonLink>
        </CardFooter>
      </Card>

      <Card className="border-primary shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Pro</CardTitle>
            <Badge>Popular</Badge>
          </div>
          <CardDescription>More generations, no ads</CardDescription>
          <ComparePrice
            amount={launchPricing.pro.amount}
            compareAt={launchPricing.pro.compareAt}
            suffix={launchPricing.pro.suffix}
          />
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>50 generations per month</p>
          <p>No AdSense placements</p>
          <p>Priority generation</p>
          <p>Email support</p>
        </CardContent>
        <CardFooter>
          {currentPlan === "pro" ? (
            <Button disabled className="w-full">
              Current plan
            </Button>
          ) : currentPlan === "lifetime" ? (
            <Button disabled className="w-full" title="Lifetime includes all Pro features">
              Included in Lifetime
            </Button>
          ) : creemEnabled && proConfigured ? (
            <CreemCheckoutButton plan="pro" label="Subscribe with Creem" />
          ) : (
            <Button disabled className="w-full" title="Configure CREEM_API_KEY and NEXT_PUBLIC_CREEM_PRODUCT_PRO">
              Coming soon
            </Button>
          )}
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lifetime</CardTitle>
          <CardDescription>One-time payment</CardDescription>
          <ComparePrice
            amount={launchPricing.lifetime.amount}
            compareAt={launchPricing.lifetime.compareAt}
          />
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>Unlimited generations</p>
          <p>No ads</p>
          <p>All current & future career pages</p>
          <p>Best for heavy job search seasons</p>
        </CardContent>
        <CardFooter>
          {currentPlan === "lifetime" ? (
            <Button disabled variant="outline" className="w-full">
              Current plan
            </Button>
          ) : creemEnabled && lifetimeConfigured ? (
            <CreemCheckoutButton
              plan="lifetime"
              label="Buy lifetime access"
              variant="outline"
            />
          ) : (
            <Button
              disabled
              variant="outline"
              className="w-full"
              title="Configure CREEM_API_KEY and NEXT_PUBLIC_CREEM_PRODUCT_LIFETIME"
            >
              Coming soon
            </Button>
          )}
        </CardFooter>
      </Card>

      {launchPricing.enabled && (
        <p className="md:col-span-3 text-center text-xs text-muted-foreground">
          Launch pricing is temporary. We may increase prices to planned regular rates without notice — pay
          today to lock in current pricing.
        </p>
      )}

      {!creemEnabled && (
        <p className="md:col-span-3 text-center text-sm text-muted-foreground">
          Paid plans activate automatically once{" "}
          <code className="rounded bg-muted px-1">CREEM_API_KEY</code> and product IDs are configured.
        </p>
      )}
    </div>
  );
}

export function getCreemStatusNote(): string | null {
  const config = getCreemConfig();
  if (!config) return null;
  const missing: string[] = [];
  if (!config.products.pro) missing.push("NEXT_PUBLIC_CREEM_PRODUCT_PRO");
  if (!config.products.lifetime) missing.push("NEXT_PUBLIC_CREEM_PRODUCT_LIFETIME");
  if (missing.length === 0) return null;
  return `Creem API connected. Missing: ${missing.join(", ")}`;
}
