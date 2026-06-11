import type { Profession } from "@/types/profession";
import { ButtonLink } from "@/components/button-link";
import { GeneratorForm } from "@/components/generator-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type ProfessionLandingProps = {
  profession: Profession;
};

export function ProfessionLanding({ profession }: ProfessionLandingProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: profession.hero.h1,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: profession.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="border-b bg-gradient-to-b from-primary/5 to-background">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="mb-4 flex flex-wrap gap-2">
            {profession.keywords.slice(0, 3).map((keyword) => (
              <Badge key={keyword} variant="secondary">
                {keyword}
              </Badge>
            ))}
          </div>
          <h1 className="max-w-3xl text-3xl font-bold tracking-tight md:text-4xl">
            {profession.hero.h1}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            {profession.hero.subtitle}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Trusted by job seekers targeting {profession.name.toLowerCase()} roles across the US.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <GeneratorForm profession={profession} />
      </section>

      <section className="border-t bg-muted/20">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-2xl font-semibold">Built for {profession.name} job applications</h2>
          <p className="mt-3 max-w-3xl text-muted-foreground">{profession.intro}</p>

          <Separator className="my-8" />

          <h3 className="text-xl font-semibold">Frequently asked questions</h3>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {profession.faqs.map((faq) => (
              <Card key={faq.question}>
                <CardHeader>
                  <CardTitle className="text-base">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {faq.answer}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="/pricing">Upgrade for more generations</ButtonLink>
            <ButtonLink href="/" variant="outline">
              Browse other careers
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
