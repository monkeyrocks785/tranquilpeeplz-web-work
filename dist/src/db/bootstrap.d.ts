/**
 * Create schema if needed and seed demo data if the database is empty.
 * Memoised per server instance — concurrent first requests share one run.
 * Skipped entirely during `next build`.
 */
export declare function ensureDatabase(): Promise<void>;
//# sourceMappingURL=bootstrap.d.ts.map