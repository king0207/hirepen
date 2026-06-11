import { ButtonLink } from "@/components/button-link";
import {
  getCreemConfig,
  getCreemProductId,
  getFreeDailyLimit,
  isCreemEnabled,
} from "@/lib/env";
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

export function PricingTable() {
  const freeLimit = getFreeDailyLimit();
  const creemEnabled = isCreemEnabled();
  const proConfigured = Boolean(getCreemProductId("pro"));
  const lifetimeConfigured = Boolean(getCreemProductId("lifetime"));

  return (
    <div className="grid gap-6 md:grid-cols-3">
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
          <p className="text-3xl font-bold">$9<span className="text-base font-normal">/mo</span></p>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>50 generations per month</p>
          <p>No AdSense placements</p>
          <p>Priority generation</p>
          <p>Email support</p>
        </CardContent>
        <CardFooter>
          {creemEnabled && proConfigured ? (
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
          <p className="text-3xl font-bold">$49</p>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>Unlimited generations</p>
          <p>No ads</p>
          <p>All current & future career pages</p>
          <p>Best for heavy job search seasons</p>
        </CardContent>
        <CardFooter>
          {creemEnabled && lifetimeConfigured ? (
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
