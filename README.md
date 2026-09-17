# VOID Society

Frontend and backend for the VOID Society site. Both deploy to Vercel; the database is
Neon Postgres.

- **Frontend** — React 19 + Vite, built to `dist/` and served as static files.
- **Backend** — Express in `server/src/`, deployed as a single Vercel Function via `api/index.js`.
- **Database** — Neon (`registrations` table). Schema lives in `server/src/setup.js`.

## Local development

```bash
npm install
cp server/.env.example server/.env    # then fill it in (see Environment)
npm run db:setup                      # creates the table if it does not exist
```

Two processes, in two terminals:

```bash
npm run dev          # frontend on http://localhost:5173
npm run dev:server   # backend on http://localhost:8080
```

`vite.config.js` proxies `/api` to port 8080, so the frontend always calls same-origin
relative paths (`/api/register`, `/api/registrations`, `/api/admin/login`) — locally, on
Vercel, and on Netlify alike. There is no API base URL to configure.

## Environment

Everything lives in `server/.env` (gitignored). The same four variables are set on Vercel.

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | yes | Neon connection string. Use the **`-pooler` host** — serverless containers churn connections. |
| `ADMIN_PASSWORD` | yes | Password the `voidb` terminal command checks. |
| `AUTH_SECRET` | yes | HMAC key for admin tokens. Generate with `openssl rand -hex 32`. |
| `FRONTEND_ORIGIN` | no | Comma-separated CORS allowlist. Only matters for cross-origin callers; the deployed frontend calls the API same-origin. |
| `PORT` | no | Local listener port, default 8080. Vercel supplies its own. |

## Deploying to Vercel

```bash
npx vercel login      # once
npm run vercel:setup  # link, push env vars, create the schema, deploy to production
```

`scripts/vercel-setup.sh` reads the four variables out of `server/.env` and pushes them into
the Vercel project for all three environments. It never prints a value. Re-running it is
safe — variables are removed before being re-added. Pass `--skip-deploy` to stop before the
deploy.

The CLI is used rather than Vercel's GitHub integration; the CLI is not a dependency, so
`npm ci` on every build stays lean.

### How the two halves fit together

`vercel.json` builds the Vite app to `dist/` and rewrites `/api/:path*` to the function in
`api/index.js`. Vercel preserves the original pathname through that rewrite, which is why
`server/src/app.js` can keep mounting its router at `/api` unchanged. Two things follow
from this layout:

- The Express app is built by `createApp()` in `server/src/app.js` and never calls
  `app.listen()` there. `server/src/index.js` is the listener — local runs and any
  long-lived host — and is not part of the Vercel deployment.
- The 2-minute Neon heartbeat in `server/src/index.js` keeps the compute awake locally. It
  cannot run on Vercel (a Hobby-plan cron fires at most once a day), so the first request
  after Neon suspends pays a cold start of a few seconds.

### After deploying

```bash
curl -s https://<deployment>/api/registrations | jq length
curl -s -o /dev/null -w '%{http_code}\n' -X POST https://<deployment>/api/register \
  -H 'content-type: application/json' -d '{}'    # expect 422
```

Vercel Functions default to `iad1` (Washington DC) while this Neon project is in
`aws-us-east-2` (Ohio). Setting the project's Function Region to `cle1` (Cleveland) under
**Settings → Functions** shortens that round trip.

## Netlify

`netlify.toml` and `netlify/functions/api.js` are still present as a fallback. That path
serves the same frontend and proxies `/api/*` to a separately hosted backend, which is why
it needs a `BACKEND_URL` variable that Vercel does not.
