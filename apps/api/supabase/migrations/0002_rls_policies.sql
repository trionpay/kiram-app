-- RLS baseline policies for fintech least-privilege

alter table users enable row level security;
alter table recipients enable row level security;
alter table transactions enable row level security;
alter table broadcasts enable row level security;
alter table audit_logs enable row level security;

-- users: a user can only see/update own row
drop policy if exists users_select_own on users;
create policy users_select_own on users
for select using (id = auth.uid());

drop policy if exists users_update_own on users;
create policy users_update_own on users
for update using (id = auth.uid());

-- recipients: own scope
drop policy if exists recipients_select_own on recipients;
create policy recipients_select_own on recipients
for select using (user_id = auth.uid());

drop policy if exists recipients_insert_own on recipients;
create policy recipients_insert_own on recipients
for insert with check (user_id = auth.uid());

drop policy if exists recipients_update_own on recipients;
create policy recipients_update_own on recipients
for update using (user_id = auth.uid());

drop policy if exists recipients_delete_own on recipients;
create policy recipients_delete_own on recipients
for delete using (user_id = auth.uid());

-- transactions: own scope
drop policy if exists transactions_select_own on transactions;
create policy transactions_select_own on transactions
for select using (user_id = auth.uid());

drop policy if exists transactions_insert_own on transactions;
create policy transactions_insert_own on transactions
for insert with check (user_id = auth.uid());

-- broadcasts / audit_logs:
-- intentionally no direct user policies; admin/service role path only
