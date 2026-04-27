-- Kiram core schema (rent + dues scope only)
create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'payment_type') then
    create type payment_type as enum ('rent', 'dues');
  end if;
  if not exists (select 1 from pg_type where typname = 'transaction_status') then
    create type transaction_status as enum ('pending', 'success', 'failed');
  end if;
  if not exists (select 1 from pg_type where typname = 'role_type') then
    create type role_type as enum ('user', 'admin');
  end if;
  if not exists (select 1 from pg_type where typname = 'broadcast_audience') then
    create type broadcast_audience as enum ('all', 'active', 'test');
  end if;
end $$;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  external_auth_id text unique,
  role role_type not null default 'user',
  full_name text,
  phone text unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists recipients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  nickname text not null,
  account_holder text not null,
  iban text not null check (iban ~ '^TR[0-9A-Z]{24}$'),
  payment_type payment_type not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_recipients_user_created on recipients(user_id, created_at desc);
create index if not exists idx_recipients_user_payment_type on recipients(user_id, payment_type);

create table if not exists transactions (
  id text primary key,
  user_id uuid not null references users(id) on delete cascade,
  recipient_id uuid references recipients(id) on delete set null,
  payment_type payment_type not null,
  amount_try numeric(12,2) not null check (amount_try > 0),
  fee_try numeric(12,2) not null check (fee_try >= 0),
  total_try numeric(12,2) not null check (total_try >= amount_try),
  status transaction_status not null,
  description text,
  provider_ref text,
  created_at timestamptz not null default now()
);

create index if not exists idx_transactions_user_created on transactions(user_id, created_at desc);
create index if not exists idx_transactions_status_created on transactions(status, created_at desc);

create table if not exists broadcasts (
  id text primary key,
  title text not null check (char_length(title) between 3 and 80),
  body text not null check (char_length(body) between 5 and 240),
  audience broadcast_audience not null,
  created_by uuid references users(id) on delete set null,
  status text not null default 'queued',
  created_at timestamptz not null default now()
);

create index if not exists idx_broadcasts_created on broadcasts(created_at desc);

create table if not exists audit_logs (
  id bigint generated always as identity primary key,
  actor_user_id uuid references users(id) on delete set null,
  actor_role role_type,
  action text not null,
  entity text not null,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_audit_logs_created on audit_logs(created_at desc);
