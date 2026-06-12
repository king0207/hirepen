import Link from "next/link";
import { SITE_NAME, getSupportEmail } from "@/config/site";
import { getEnabledProfessions } from "@/config/professions";
import { ButtonLink } from "@/components/button-link";
import { AuthStatus } from "@/components/auth/auth-status";

export function SiteHeader() {
  const professions = getEnabledProfessions();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          {SITE_NAME}
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          <ButtonLink href="/" variant="ghost" size="sm">
            Home
          </ButtonLink>
          {professions.slice(0, 4).map((p) => (
            <ButtonLink key={p.slug} href={`/${p.slug}`} variant="ghost" size="sm">
              {p.name}
            </ButtonLink>
          ))}
          <ButtonLink href="/pricing" variant="ghost" size="sm">
            Pricing
          </ButtonLink>
          <AuthStatus />
        </nav>
        <div className="flex items-center gap-1 md:hidden">
          <ButtonLink href="/" size="sm" variant="ghost">
            Home
          </ButtonLink>
          <ButtonLink href="/pricing" size="sm" variant="ghost">
            Pricing
          </ButtonLink>
          <AuthStatus />
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const supportEmail = getSupportEmail();

  return (
    <footer className="mt-auto border-t bg-muted/30">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} {SITE_NAME}. AI drafts require your review before submitting.</p>
        <div className="flex flex-wrap gap-4">
          {supportEmail && (
            <a href={`mailto:${supportEmail}`} className="hover:text-foreground">
              Contact
            </a>
          )}
          <Link href="/privacy" className="hover:text-foreground">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-foreground">
            Terms
          </Link>
          <Link href="/pricing" className="hover:text-foreground">
            Pricing
          </Link>
        </div>
      </div>
    </footer>
  );
}
