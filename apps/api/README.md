# Kiram API

Backend foundation for Kiram fintech flows, scoped to `rent` and `dues`.

## Run

```bash
cp .env.example .env
npm install --workspaces=false
npm run dev
```

## Migrations (Supabase SQL)

- `supabase/migrations/0001_core_schema.sql`
- `supabase/migrations/0002_rls_policies.sql`

After migrations, insert demo users (required for current bearer-token auth mapping):

```sql
insert into users (id, role, full_name, phone)
values
  ('11111111-1111-1111-1111-111111111111', 'admin', 'Admin Demo', '+905550000001')
on conflict (id) do nothing;

insert into users (id, role, full_name, phone)
values
  ('22222222-2222-2222-2222-222222222222', 'user', 'User Demo', '+905550000002')
on conflict (id) do nothing;
```

## Security Defaults

- Helmet HTTP security headers
- Global rate limit (`120 req/min`)
- Strict env validation (`zod`)
- Role-based guard (`user` / `admin`) with bearer token
- Centralized error format

## Initial Endpoints

- `GET /health`
- `GET /api/v1`
- `GET /api/v1/recipients` (auth: user)
- `POST /api/v1/payments/quote` (auth: user)
- `POST /api/v1/payments` (auth: user)
- `GET /api/v1/admin/transactions/summary` (auth: admin)
- `POST /api/v1/admin/broadcasts` (auth: admin)

## Notes

- Current implementation uses secure mocks for speed.
- Supabase helper is present and ready to be wired into repositories.
- Repository layer writes/reads Supabase when env is configured, otherwise safe mock fallback is used.
- Do not expose `SUPABASE_SERVICE_ROLE_KEY` to client apps.
