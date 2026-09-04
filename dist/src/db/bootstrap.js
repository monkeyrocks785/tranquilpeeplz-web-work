import { pool } from "./index.js";
/**
 * Idempotent schema bootstrap.
 *
 * Runs `CREATE … IF NOT EXISTS` for every table, enum and index the app
 * needs, then seeds demo content when the database is empty. This runs
 * automatically once per server boot (see src/instrumentation.ts), so a
 * fresh deploy on Vercel — pointed at an empty hosted Postgres (Aiven,
 * Neon, Vercel Postgres, Supabase…) — becomes fully functional on first request.
 *
 * Keep this in sync with src/db/schema.ts. For iterative local development
 * you can also run `npm run db:push` (drizzle-kit).
 */
const DDL = `/*DDL_START*/
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'job_status') THEN
    CREATE TYPE "job_status" AS ENUM ('pending', 'open', 'closed');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'application_status') THEN
    CREATE TYPE "application_status" AS ENUM ('applied', 'reviewing', 'interview', 'offered', 'rejected');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'employment_type') THEN
    CREATE TYPE "employment_type" AS ENUM ('full-time', 'contract', 'part-time', 'temporary');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'work_mode') THEN
    CREATE TYPE "work_mode" AS ENUM ('on-site', 'hybrid', 'remote');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "companies" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" varchar(180) NOT NULL,
  "website" varchar(220),
  "industry" varchar(120),
  "size" varchar(60),
  "location" varchar(160),
  "description" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "jobs" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "company_id" uuid NOT NULL REFERENCES "companies"("id") ON DELETE cascade,
  "contact_name" varchar(160) NOT NULL,
  "contact_email" varchar(220) NOT NULL,
  "title" varchar(180) NOT NULL,
  "slug" varchar(220) NOT NULL,
  "industry" varchar(120) NOT NULL,
  "location" varchar(160) NOT NULL,
  "work_mode" "work_mode" DEFAULT 'on-site' NOT NULL,
  "employment_type" "employment_type" DEFAULT 'full-time' NOT NULL,
  "experience_min" integer DEFAULT 0 NOT NULL,
  "experience_max" integer DEFAULT 2 NOT NULL,
  "salary_min" integer,
  "salary_max" integer,
  "summary" text NOT NULL,
  "description" text NOT NULL,
  "responsibilities" text[] DEFAULT '{}'::text[] NOT NULL,
  "requirements" text[] DEFAULT '{}'::text[] NOT NULL,
  "skills" text[] DEFAULT '{}'::text[] NOT NULL,
  "openings" integer DEFAULT 1 NOT NULL,
  "featured" boolean DEFAULT false NOT NULL,
  "status" "job_status" DEFAULT 'pending' NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "jobs_slug_unique" UNIQUE ("slug")
);
CREATE INDEX IF NOT EXISTS "jobs_status_idx" ON "jobs" ("status");
CREATE INDEX IF NOT EXISTS "jobs_industry_idx" ON "jobs" ("industry");
CREATE INDEX IF NOT EXISTS "jobs_company_idx" ON "jobs" ("company_id");

CREATE TABLE IF NOT EXISTS "applications" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "job_id" uuid NOT NULL REFERENCES "jobs"("id") ON DELETE cascade,
  "applicant_name" varchar(160) NOT NULL,
  "applicant_email" varchar(220) NOT NULL,
  "applicant_phone" varchar(40),
  "resume_url" text,
  "cover_note" text,
  "status" "application_status" DEFAULT 'applied' NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS "applications_job_idx" ON "applications" ("job_id");

CREATE TABLE IF NOT EXISTS "contact_messages" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" varchar(160) NOT NULL,
  "email" varchar(220) NOT NULL,
  "phone" varchar(40),
  "topic" varchar(80) DEFAULT 'general' NOT NULL,
  "message" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "blog_posts" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "slug" varchar(220) NOT NULL,
  "title" varchar(220) NOT NULL,
  "excerpt" text NOT NULL,
  "category" varchar(80) NOT NULL,
  "cover_image" text,
  "read_minutes" integer DEFAULT 4 NOT NULL,
  "author_name" varchar(120) NOT NULL,
  "content" text NOT NULL,
  "published_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "blog_posts_slug_unique" UNIQUE ("slug")
);

CREATE TABLE IF NOT EXISTS "email_logs" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "kind" varchar(40) NOT NULL,
  "to_email" varchar(220) NOT NULL,
  "subject" varchar(300) NOT NULL,
  "body" text NOT NULL,
  "csv_payload" text,
  "status" varchar(20) DEFAULT 'queued' NOT NULL,
  "error" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
/*DDL_END*/`;
let bootPromise = null;
async function doBootstrap() {
    const attempts = 3;
    let lastError = null;
    for (let i = 0; i < attempts; i++) {
        try {
            await pool.query(DDL);
            const { seedIfEmpty } = await import("./seed.js");
            const result = await seedIfEmpty();
            if (result.seeded) {
                console.log(`[db] Schema ready. Seeded demo data (${result.jobs} jobs, companies, blog posts).`);
            }
            else {
                console.log("[db] Schema ready. Existing data found — seed skipped.");
            }
            return;
        }
        catch (err) {
            lastError = err;
            console.error(`[db] Bootstrap attempt ${i + 1}/${attempts} failed:`, err instanceof Error ? err.message : err);
            await new Promise((r) => setTimeout(r, 800 * (i + 1)));
        }
    }
    console.error("[db] Bootstrap gave up. Check DATABASE_URL. The app will still serve " +
        "requests that do not need the database.", lastError);
}
/**
 * Create schema if needed and seed demo data if the database is empty.
 * Memoised per server instance — concurrent first requests share one run.
 * Skipped entirely during `next build`.
 */
export async function ensureDatabase() {
    if (process.env.NEXT_PHASE === "phase-production-build")
        return;
    if (process.env.SKIP_DB_BOOTSTRAP === "1")
        return;
    if (!bootPromise) {
        bootPromise = doBootstrap().catch((err) => {
            // Allow a future request to retry.
            bootPromise = null;
            throw err;
        });
    }
    return bootPromise;
}
//# sourceMappingURL=bootstrap.js.map