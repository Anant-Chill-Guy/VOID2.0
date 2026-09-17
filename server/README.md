# VOID Server

Express backend for VOID Society — collects registrations and powers the hidden admin panel.

The dependency manifest lives at the repo root, not here: Vercel only installs dependencies
from the root `package.json`, and the backend runs as a Vercel Function. Run everything from
the repo root. See the [root README](../README.md) for local setup and deployment.

## Layout

| File | Role |
|---|---|
| `src/app.js` | `createApp()` — builds the Express app, no listener. Used by both entries below. |
| `src/index.js` | Long-running entry: Neon heartbeat + `app.listen()`. Local dev and any non-serverless host. |
| `../api/index.js` | Vercel Function entry: builds the app once and delegates to it. |
| `src/config.js` | Reads and validates the environment. Throws if a required variable is missing. |
| `src/db.js` | `pg` pool and the `query()` helper. |
| `src/routes.js` | Route handlers. |
| `src/auth.js` | Admin token signing/verification and the per-IP login rate limiter. |
| `src/validate.js` | Registration field validation. |
| `src/setup.js` | Creates the `registrations` table. Idempotent — `npm run db:setup`. |

## Run

```bash
npm run dev:server    # http://localhost:8080
```

The frontend dev server (Vite, port 5173) proxies `/api` to this server automatically.

## Neon database

`npm run db:setup` creates the table and index if they do not already exist:

```sql
CREATE TABLE IF NOT EXISTS registrations (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  branch        TEXT NOT NULL,
  year          TEXT,
  email         TEXT NOT NULL UNIQUE,
  whatsapp      TEXT NOT NULL,
  accommodation TEXT NOT NULL,
  domain        TEXT,
  domain2       TEXT,
  domain3       TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations (email);
```

Use the `-pooler` host of the Neon connection string. Serverless containers each open their
own pool, and the pooler is what keeps that from exhausting Neon's connection limit.

## API

All routes are mounted under `/api`.

| Method | Path                | Auth   | Description |
|--------|---------------------|--------|-------------|
| POST   | `/api/register`     | public | JSON `{ name, branch, year, email, whatsapp, accommodation, domains[] }`. `@kiet.edu` addresses only. `422` with per-field `errors` on validation failure, `409` on a duplicate email. |
| POST   | `/api/admin/login`  | public | `{ password }` → `{ token }`. Rate-limited to 5 attempts per IP per 15 minutes. |
| GET    | `/api/admin/verify` | Bearer | Validates an admin token. |
| GET    | `/api/registrations`| **public** | Every registration, newest first. |

> `GET /api/registrations` currently has no auth and returns each registrant's name, email
> and WhatsApp number to anyone who asks. The frontend stores an admin token at login
> (`terminal.jsx`) but never sends it on this request.

## Admin panel

On the frontend, the `/panel-sight` route shows the panel. Access it by running `voidb`
in the `/terminal` and entering the `ADMIN_PASSWORD`. The route and command are intentionally
not linked anywhere or listed in the terminal `help`.
