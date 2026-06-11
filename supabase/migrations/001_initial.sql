-- =============================================================================
-- HirePen — schema + Row Level Security (RLS)  [idempotent rebuild]
-- -----------------------------------------------------------------------------
-- ⚠️  This script DROPS and RECREATES the tables. Running it deletes existing
--     rows. Safe for a clean rebuild.
--
-- Auth architecture (self-managed sessions):
--   * Account/password users live in `app_users` (password hashed by the app).
--   * GitHub login uses Supabase OAuth; on callback the app upserts the user
--     into `app_users` and issues its OWN signed-cookie session.
--   * Because end users do NOT hold a Supabase JWT, all DB access goes through
--     the server using the SERVICE ROLE key (which bypasses RLS).
--
-- RLS posture:
--   * RLS is enabled + forced on every table and locked to the service role.
--   * anon / authenticated client roles get NO access (defense in depth).
--   * "admin sees all / user sees own" is enforced in application code using
--     the signed session (see src/lib/auth), since RLS cannot read our session.
-- =============================================================================

create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- Drop existing objects (clean rebuild). Order respects FK dependencies.
-- -----------------------------------------------------------------------------
drop table if exists public.usage_limits   cascade;
drop table if exists public.generations    cascade;
drop table if exists public.payment_events cascade;
drop table if exists public.app_users      cascade;
drop function if exists public.is_admin()  cascade;

-- -----------------------------------------------------------------------------
-- app_users — canonical identity for both password and GitHub accounts
-- -----------------------------------------------------------------------------
create table public.app_users (
  id            uuid primary key default gen_random_uuid(),
  email         text not null,
  password_hash text,                                   -- null for OAuth-only accounts
  provider      text not null default 'password'        -- 'password' | 'github'
                 check (provider in ('password', 'github')),
  github_id     text unique,
  is_admin      boolean not null default false,
  created_at    timestamptz not null default now()
);

create unique index uq_app_users_email on public.app_users (lower(email));

-- -----------------------------------------------------------------------------
-- usage_limits — per-session (and optional per-user) daily generation counter
-- -----------------------------------------------------------------------------
create table public.usage_limits (
  id          uuid primary key default gen_random_uuid(),
  session_id  text not null,
  user_id     uuid references public.app_users (id) on delete cascade,
  usage_date  date not null default current_date,
  count       int  not null default 0,
  created_at  timestamptz not null default now(),
  unique (session_id, usage_date)
);

create index idx_usage_limits_session_date on public.usage_limits (session_id, usage_date);
create index idx_usage_limits_user         on public.usage_limits (user_id);

-- -----------------------------------------------------------------------------
-- generations — analytics log of each generated document
-- -----------------------------------------------------------------------------
create table public.generations (
  id              uuid primary key default gen_random_uuid(),
  session_id      text,
  user_id         uuid references public.app_users (id) on delete cascade,
  profession_slug text not null,
  doc_type        text not null check (doc_type in ('resume', 'cover_letter')),
  created_at      timestamptz not null default now()
);

create index idx_generations_created_at on public.generations (created_at desc);
create index idx_generations_user        on public.generations (user_id);

-- -----------------------------------------------------------------------------
-- payment_events — Creem webhook audit log
-- -----------------------------------------------------------------------------
create table public.payment_events (
  id          uuid primary key default gen_random_uuid(),
  event_type  text not null,
  payload     jsonb not null,
  created_at  timestamptz not null default now()
);

-- =============================================================================
-- Row Level Security — enable, force, and lock to service role only
-- =============================================================================
alter table public.app_users     enable row level security;
alter table public.usage_limits  enable row level security;
alter table public.generations   enable row level security;
alter table public.payment_events enable row level security;

alter table public.app_users     force row level security;
alter table public.usage_limits  force row level security;
alter table public.generations   force row level security;
alter table public.payment_events force row level security;

-- No policies are created for `anon` or `authenticated`. With RLS enabled and
-- no permissive policy, those client roles cannot read or write any rows.
-- The service role (server) bypasses RLS and performs all reads/writes.

-- Defense in depth: remove direct table privileges from public client roles.
revoke all on public.app_users     from anon, authenticated;
revoke all on public.usage_limits  from anon, authenticated;
revoke all on public.generations   from anon, authenticated;
revoke all on public.payment_events from anon, authenticated;
