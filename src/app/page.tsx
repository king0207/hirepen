import Link from "next/link";
import { getEnabledProfessions } from "@/config/professions";
import { ButtonLink } from "@/components/button-link";
import { LaunchPricingExitDialog } from "@/components/launch-pricing-exit-dialog";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HomePage() {
  const professions = getEnabledProfessions();

  return (
    <div>
      <LaunchPricingExitDialog />
      <section className="border-b bg-gradient-to-b from-primary/5 to-background">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <Badge variant="secondary" className="mb-4">
            Career-specific tools — not a generic resume builder
          </Badge>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
            Resume & cover letter generators built for your job
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Pick your profession and generate a US-style resume or cover letter tuned to
            what hiring managers in your field actually look for.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={`/${professions[0]?.slug ?? "nurse"}`} size="lg">
              Try nurse tool
            </ButtonLink>
            <ButtonLink href="/pricing" variant="outline" size="lg">
              View pricing
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-semibold">Choose your career page</h2>
        <p className="mt-2 text-muted-foreground">
          Each page targets real search terms for that role — add more careers anytime via config.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {professions.map((profession) => (
            <Card key={profession.slug} className="flex flex-col">
              <CardHeader>
                <CardTitle>{profession.name}</CardTitle>
                <CardDescription>{profession.hero.subtitle}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto space-y-3">
                <div className="flex flex-wrap gap-2">
                  {profession.keywords.slice(0, 2).map((keyword) => (
                    <Badge key={keyword} variant="outline" className="text-xs font-normal">
                      {keyword}
                    </Badge>
                  ))}
                </div>
                <ButtonLink href={`/${profession.slug}`} className="w-full">
                  Open {profession.name} tool
                </ButtonLink>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
