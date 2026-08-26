# Tranquil Peeplz — Vercel Deployment Guide

## Quick Deploy to Vercel

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 2. Import to Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Vercel will auto-detect the configuration from `vercel.json`

### 3. Configure Environment Variables
In Vercel Dashboard → Settings → Environment Variables, add:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | **Aiven PostgreSQL connection string** | `postgresql://avnadmin:password@your-project.aivencloud.com:26257/defaultdb?sslmode=require` |
| `ADMIN_PASSCODE` | Admin dashboard password | `your-secure-passcode` |
| `OWNER_EMAIL` | Where applicant notifications go | `contact@tranquilpeeplz.com` |
| `EMAIL_FROM` | Sender identity for emails | `Tranquil Peeplz <no-reply@tranquilpeeplz.com>` |
| `SESSION_SECRET` | Generate with `openssl rand -base64 32` | `abc123...` |
| `SMTP_URL` | Email delivery (optional) | `smtps://user:pass@smtp.provider.com:465` |

### 4. Add Aiven PostgreSQL
1. Create an Aiven account at [aiven.io](https://aiven.io)
2. Create a PostgreSQL service
3. Copy the connection URI → paste as `DATABASE_URL` in Vercel
4. Ensure `sslmode=require` is in the connection string

### 5. Deploy
Click **Deploy** — Vercel will build and deploy automatically.

---

## Local Development

### Option A: Local PostgreSQL (No Docker)
**Windows:** Download installer from [postgresql.org/download/windows](https://www.postgresql.org/download/windows/)
**macOS:** `brew install postgresql@16 && brew services start postgresql@16`
**Linux:** `sudo apt install postgresql-16` (or your distro's package)

```bash
# 1. Create database
psql -U postgres -c "CREATE DATABASE app_db;"

# 2. Copy env and set local DATABASE_URL
cp .env.example .env
# Edit .env: DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/app_db

# 3. Install deps and run
npm install
npm run dev
```

### Option B: Use Aiven for Local Development
```bash
# 1. Copy env
cp .env.example .env
# 2. Edit .env with your Aiven DATABASE_URL
# 3. Run
npm run dev
```

### Option C: Vercel Postgres (Free tier)
1. Go to Vercel Dashboard → Storage → Create Database → Postgres
2. Copy the connection string
3. Set as `DATABASE_URL` in `.env`
4. Works locally and in production

---

## Project Structure

```
├── api/index.ts           # Vercel serverless entry point
├── server.ts              # Local development server
├── src/
│   ├── app.ts             # Express app (shared)
│   ├── db/
│   │   ├── index.ts       # PostgreSQL connection (Aiven/Vercel/local)
│   │   ├── bootstrap.ts   # Auto-migrate + seed on first request
│   │   ├── schema.ts      # Drizzle schema
│   │   └── seed.ts        # Demo data
│   ├── lib/
│   │   ├── email.ts       # Nodemailer + outbox
│   │   ├── jobs-service.ts # Business logic
│   │   └── data.ts        # Queries
│   ├── web/               # Server-rendered pages
│   └── styles/            # Tailwind CSS
├── vercel.json            # Vercel configuration
└── drizzle.config.ts      # Drizzle Kit config
```

---

## Email Setup

Emails are **always stored in the `email_logs` outbox** (visible in `/admin`) even without SMTP.

To actually deliver emails, configure **one** of:

**Option A — Single URL (recommended):**
```bash
SMTP_URL=smtps://user:pass@smtp.provider.com:465
```

**Option B — Individual fields:**
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=you@gmail.com
SMTP_PASS=your-16-char-app-password
```

---

## Database Commands

```bash
# Push schema changes to database
npm run db:push

# Generate migration files
npm run db:generate

# Open Drizzle Studio (local only)
npm run db:studio
```

---

## Admin Dashboard

Access at `/admin` with your `ADMIN_PASSCODE`. Features:
- Approve/reject job postings
- View all applications with CSV export
- View email outbox
- Site statistics

---

## Email Templates

Implemented email triggers:
| Trigger | Kind | Recipient |
|---------|------|-----------|
| Employer posts job | `job_thank_you` | Employer |
| Employer posts job | `new_job_pending` | Admin |
| Job seeker applies | `new_application_owner` | Admin |
| Job seeker applies | `application_received` | Job seeker |
| Job approved | `job_approved` | Employer |

Templates in `src/lib/jobs-service.ts` and `src/lib/email.ts`.

---

## Troubleshooting

**"DATABASE_URL is required"**
- Ensure `DATABASE_URL` is set in Vercel environment variables
- For local: check `.env` file exists

**SSL connection errors**
- Aiven/Neon require `sslmode=require` in connection string
- Local PostgreSQL: use `sslmode=disable` or omit SSL

**Build fails on Vercel**
- Check `vercel.json` buildCommand: `npm run build`
- Ensure all TypeScript errors pass locally: `npm run typecheck`

**Emails not sending**
- Check `/admin` → Email Logs for delivery status
- Verify SMTP credentials
- Emails are always logged even if SMTP fails

---

## Support

- GitHub Issues: [github.com/your-repo/issues](https://github.com/your-repo/issues)
- Email: contact@tranquilpeeplz.com