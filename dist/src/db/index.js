import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
const databaseUrl = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
// Hosted Postgres providers (Aiven, Neon, Vercel Postgres, Supabase…) require SSL.
// Local development (localhost / 127.0.0.1) does not.
const isLocal = databaseUrl ? /localhost|127\.0\.0\.1/.test(databaseUrl) : true;
const sslDisabled = databaseUrl ? /sslmode=disable/.test(databaseUrl) : false;
const ssl = !isLocal && !sslDisabled ? { rejectUnauthorized: false } : undefined;
const globalForDb = globalThis;
// Pool is lazy: created only if DATABASE_URL is present.
// This prevents a module-load crash on Vercel when the function cold-starts
// before env vars are fully injected. Actual DB calls will throw meaningfully.
export const pool = globalForDb.__arenaNextJsPostgresqlPool ??
    (() => {
        if (!databaseUrl) {
            // Return a dummy pool that throws on first use instead of crashing at import.
            const dummy = new Pool({ connectionString: "postgresql://localhost/placeholder" });
            return dummy;
        }
        return new Pool({
            connectionString: databaseUrl,
            ssl,
            // Keep the per-instance pool small: serverless platforms (Vercel) create
            // one pool per function instance, so connection fan-out adds up fast.
            max: isLocal ? 10 : 4,
            idleTimeoutMillis: 30_000,
            connectionTimeoutMillis: 10_000,
        });
    })();
if (process.env.NODE_ENV !== "production") {
    globalForDb.__arenaNextJsPostgresqlPool = pool;
}
export const db = drizzle(pool);
//# sourceMappingURL=index.js.map