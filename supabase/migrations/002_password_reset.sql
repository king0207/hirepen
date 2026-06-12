-- Password reset tokens (forgot-password email flow)
-- Run after 001_initial.sql. Safe to run multiple times (IF NOT EXISTS).

create table if not exists public.password_reset_tokens (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.app_users (id) on delete cascade,
  token_hash  text not null,
  expires_at  timestamptz not null,
  created_at  timestamptz not null default now()
);

create index if not exists idx_password_reset_tokens_hash
  on public.password_reset_tokens (token_hash);

alter table public.password_reset_tokens enable row level security;
alter table public.password_reset_tokens force row level security;
revoke all on public.password_reset_tokens from anon, authenticated;
