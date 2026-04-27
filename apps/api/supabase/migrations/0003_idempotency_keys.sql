create table if not exists idempotency_keys (
  scope text not null,
  key text not null,
  status_code integer not null,
  response jsonb not null,
  created_at timestamptz not null default now(),
  primary key (scope, key)
);

create index if not exists idx_idempotency_created_at on idempotency_keys(created_at desc);
