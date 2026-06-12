-- =============================================================================
-- HirePen — user subscription plans (additive; safe to run on existing DB)
-- -----------------------------------------------------------------------------
-- Adds plan entitlements to app_users for Creem webhook upgrades:
--   free     → 3 generations/day (default)
--   pro      → 50 generations/month, no ads
--   lifetime → unlimited generations, no ads
-- =============================================================================

alter table public.app_users
  add column if not exists plan text not null default 'free'
    check (plan in ('free', 'pro', 'lifetime'));

alter table public.app_users
  add column if not exists plan_updated_at timestamptz;

alter table public.app_users
  add column if not exists creem_customer_id text;

create index if not exists idx_app_users_plan on public.app_users (plan);
