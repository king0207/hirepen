# HirePen

AI-powered resume & cover letter generator for the US job market, with dedicated
landing pages for each profession (nurse, teacher, CNA, and more). Built for
long-tail SEO: every profession gets its own statically-generated page targeting
specific search intent (e.g. "nurse cover letter example").

Users describe their experience, pick a document type and tone, and get an
ATS-friendly draft streamed back in real time.

## Features

- **Multi-profession landing pages** — one SEO-optimized page per role, driven by
  a single config file (`src/config/professions.ts`). Add or disable a profession
  without touching any other code.
- **AI generation (streaming)** — provider-agnostic, OpenAI-compatible. Works with
  Alibaba Qwen (US region), OpenAI, OpenRouter, Groq, DeepSeek, etc. Switch with
  env vars only.
- **Self-managed auth** — email + password (scrypt-hashed) with an SVG captcha,
  plus GitHub OAuth via Supabase. Sessions are signed JWTs in HTTP-only cookies
  (`jose`); end users never hold a Supabase token.
- **Roles** — admins get an `/admin` dashboard (all users / generations / payments)
  and are exempt from the daily generation limit. Regular users see only their own
  generation history on `/account`.
- **Monetization, graceful by default** — Creem checkout and Google AdSense are
  fully integrated but inert until configured (no keys = features simply hide).
- **SEO built in** — SSG profession pages, dynamic `sitemap.xml` / `robots.txt`,
  privacy & terms pages.

## Tech stack

| Area      | Choice                                            |
| --------- | ------------------------------------------------- |
| Framework | Next.js 16 (App Router, Turbopack)                |
| UI        | React 19, Tailwind CSS v4, shadcn/ui (base-ui)    |
| Auth      | Self-managed JWT sessions (`jose`) + Supabase OAuth |
| Database  | Supabase (Postgres) with Row Level Security       |
| AI        | Any OpenAI-compatible API (streaming)             |
| Payments  | Creem                                             |
| Ads       | Google AdSense                                    |
| Hosting   | Vercel                                            |

## Project structure

```
src/
  app/                  # routes (App Router)
    [profession]/       # dynamic SEO landing page per profession
    account/            # user dashboard (own generation history)
    admin/              # admin dashboard (all data) — role-gated
    api/                # auth, captcha, generate, checkout, webhooks
    auth/callback/      # GitHub OAuth callback -> issues our session
  components/           # UI + feature components
  config/               # site + professions config (edit to add roles)
  lib/
    ai.ts               # streaming chat against any OpenAI-compatible API
    auth/               # session (jose), password (scrypt), captcha, users
    data.ts             # admin/account data access (service role)
    rate-limit.ts       # daily free-generation limits
  instrumentation.ts    # routes Node fetch through a proxy in local dev
  proxy.ts              # protects /account and /admin (Next.js 16 "proxy")
supabase/migrations/    # database schema + RLS
docs/DEPLOY.md          # full step-by-step deployment guide (中文)
```

## Quick start

```bash
# 1. Install deps
npm install            # on Windows PowerShell, use: npm.cmd install

# 2. Configure environment
cp env.example .env.local
#   then fill in AI_API_KEY, AUTH_SESSION_SECRET, and Supabase keys

# 3. Create the database schema
#   Supabase dashboard -> SQL Editor -> paste & run
#   supabase/migrations/001_initial.sql

# 4. Run
npm run dev            # http://localhost:3000
```

Generate `AUTH_SESSION_SECRET` with:

```bash
openssl rand -base64 32
```

## Environment variables

See `env.example` for the full list. Essentials:

| Variable                          | Required | Purpose                                   |
| --------------------------------- | -------- | ----------------------------------------- |
| `AI_API_KEY` / `AI_BASE_URL` / `AI_MODEL` | yes | AI provider (OpenAI-compatible)       |
| `AUTH_SESSION_SECRET`             | yes      | Signs session + captcha cookies           |
| `NEXT_PUBLIC_SUPABASE_URL` / `..._ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` | yes | Users, GitHub OAuth, rate limits |
| `CREEM_*` / `NEXT_PUBLIC_CREEM_*` | no       | Payments (hidden if unset)                |
| `NEXT_PUBLIC_ADSENSE_*`           | no       | Ads (not rendered if unset)               |
| `HTTPS_PROXY`                     | no       | Local dev only — route Node fetch via a proxy |
| `FREE_DAILY_LIMIT`                | no       | Daily free generations (default 3)        |

> **Local dev behind a VPN/proxy?** Node's `fetch` ignores the system proxy, which
> breaks server-side calls to Supabase. Set `HTTPS_PROXY=http://127.0.0.1:PORT`
> and `src/instrumentation.ts` will route Node traffic through it.

## Admin setup

1. Register or log in once to create your account in `app_users`.
2. Promote yourself in the Supabase SQL Editor:

   ```sql
   update public.app_users set is_admin = true
   where lower(email) = lower('you@example.com');
   ```

3. Log out and back in (the admin flag lives in the session token). You'll see an
   **Admin** link and can open `/admin`.

## Adding a profession

Edit `src/config/professions.ts` and add an object (or set `enabled: false` to
hide one). The landing page, SEO metadata, sitemap entry, and nav update
automatically — no other code changes needed.

## Deployment

Deploy to Vercel and add the environment variables in the project settings. A
full, step-by-step guide (in Chinese) lives in [`docs/DEPLOY.md`](docs/DEPLOY.md),
covering AI setup, Supabase, GitHub OAuth, Creem, AdSense, custom domain, and the
post-launch SEO checklist.

## License

Private project. All rights reserved.
