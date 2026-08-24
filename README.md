# Tranquil Peeplz — Recruitment Consultancy Platform

A pure **Node.js** rebuild of the Tranquil Peeplz website (recruitment
consultancy, Bangalore). **No Next.js, no React, no bundler** — an Express
server renders every page on the server and PostgreSQL is the single source
of truth. The design, pages and flows are identical to the previous build.

## Stack

- **Node.js + Express 5** (TypeScript, run with `tsx` — no build step)
- **PostgreSQL** via **Drizzle ORM**
- **Nodemailer** for email delivery (with a DB-backed outbox)
- **Tailwind CSS v4** — compiled once to `public/app.css` via the CLI
- Server-rendered HTML (template literals), one tiny vanilla JS enhancer
  script for menu/scroll reveals/counters. Forms work with zero JS.

## The flow

1. **Employer posts a role** at `/post-a-job` (no account). It lands in the
   queue as `pending` — never visible publicly yet.
2. **Thank-you email** goes to the recruiter on submit. Every email is
   recorded in the `email_logs` outbox first, so nothing is ever lost —
   delivery happens once SMTP env vars are set.
3. **Site owner approves** at `/admin` (passcode-gated via `ADMIN_PASSCODE`).
4. **Approved roles appear** on `/job-search` — the board only shows `open`.
5. **Job seekers click Apply now** (no account). Details are stored in
   Postgres **and emailed to the site owner as a CSV attachment**. Full
   export anytime: `/admin` → *Export all applications (CSV)*
   (`GET /api/applications.csv`, passcode cookie required).

### JSON API

| Route | Method | Purpose |
| --- | --- | --- |
| `/api/jobs` | POST | Submit a role for approval (JSON) |
| `/api/applications` | POST | Apply to a role (JSON) |
| `/api/applications.csv` | GET | Full CSV export (admin) |
| `/api/seed` | GET/POST | Idempotent schema check + demo seed |
| `/api/health` | GET | DB health probe |

## Data persistence

Everything lives in PostgreSQL — companies, jobs, applications, contact
messages, blog posts and the email outbox. Nothing on the filesystem, so
data persists on any host as long as `DATABASE_URL` points at your Postgres.

On first request the server runs an idempotent bootstrap
(`src/db/bootstrap.ts`): creates every enum/table/index with
`CREATE … IF NOT EXISTS`, then seeds demo content (13 approved jobs,
8 companies, 4 articles) **only if the jobs table is empty**. A fresh empty
database works on first request; restarts never duplicate data.

## Local development

```bash
cp .env.example .env        # set DATABASE_URL (and ADMIN_PASSCODE)
npm install
npm run dev                 # compiles public/app.css, then tsx watch server.ts
```

Build CSS once (done automatically by `dev`/`build`):

```bash
npm run css
```

Admin dashboard: **`/admin`** — default passcode `peeplz-admin`
(**change `ADMIN_PASSCODE` before deploying**).

## Deploy

### Plain Node host (Railway / Render / VPS)

```bash
npm run build && npm start     # PORT env respected, defaults to 3000
```

### GitHub + Vercel

Default Vercel project settings work — `vercel.json` rewrites all traffic to
the serverless adapter in `api/index.ts`, which serves the same Express app.

1. **Push to GitHub** (`.env` is never committed).
2. **Vercel Postgres (easiest):** Storage → Create Database → Postgres →
   Connect Project. Vercel injects `POSTGRES_URL` and the app picks it up
   automatically (or set `DATABASE_URL` from any Postgres provider).
3. **Env vars:**

   ```
   ADMIN_PASSCODE   = <something strong>
   OWNER_EMAIL      = <where applicant CSVs should land>
   EMAIL_FROM       = Tranquil Peeplz <no-reply@yourdomain.com>
   SMTP_URL         = smtps://user:pass@smtp.provider.com:465   (optional)
   ```

   Without SMTP the site still works perfectly — emails queue in the
   `email_logs` outbox (visible in `/admin`).

4. **Deploy.** First request auto-creates schema + demo data; every later
   submission, approval and application persists in the same database.

## Scripts

```bash
npm run dev          # css build + tsx watch
npm run build        # css build
npm run start        # tsx server.ts (production)
npm run typecheck    # tsc --noEmit
npm run db:push      # push schema.ts to DATABASE_URL (drizzle-kit)
npm run db:studio    # Drizzle Studio
```
