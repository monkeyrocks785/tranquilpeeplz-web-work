import "dotenv/config";

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is required. Set it in .env locally, or in your Vercel project settings for production.",
  );
}

// Hosted Postgres providers (Aiven, Neon, Vercel Postgres, Supabase…) require SSL.
// Local development (localhost / 127.0.0.1) does not.
const isLocal = /localhost|127\.0\.0\.1/.test(databaseUrl);
const sslDisabled = /sslmode=disable/.test(databaseUrl);
const ssl =
  !isLocal && !sslDisabled ? { rejectUnauthorized: false } : undefined;

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

export const pool =
  globalForDb.__arenaNextJsPostgresqlPool ??
  new Pool({
    connectionString: databaseUrl,
    ssl,
    // Keep the per-instance pool small: serverless platforms (Vercel) create
    // one pool per function instance, so connection fan-out adds up fast.
    max: isLocal ? 10 : 4,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const db = drizzle(pool);