/**
 * Idempotent seed: inserts companies, approved jobs and blog posts only when
 * the jobs table is empty. No user accounts exist in this build.
 */
export declare function seedIfEmpty(): Promise<{
    seeded: boolean;
    jobs?: number;
}>;
//# sourceMappingURL=seed.d.ts.map