-- usage tracking (anonymous sessions)
create table if not exists usage_limits (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  usage_date date not null default current_date,
  count int not null default 0,
  unique (session_id, usage_date)
);

create index if not exists idx_usage_limits_session_date
  on usage_limits (session_id, usage_date);

-- generation analytics
create table if not exists generations (
  id uuid primary key default gen_random_uuid(),
  session_id text,
  profession_slug text not null,
  doc_type text not null check (doc_type in ('resume', 'cover_letter')),
  created_at timestamptz not null default now()
);

create index if not exists idx_generations_created_at
  on generations (created_at desc);

-- creem webhook audit log
create table if not exists payment_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

alter table usage_limits enable row level security;
alter table generations enable row level security;
alter table payment_events enable row level security;
