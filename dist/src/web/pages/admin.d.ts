import type { Application, Company, EmailLog, Job } from "../../db/schema.js";
export declare function adminLoginPage(p?: {
    message?: string;
    errors?: Record<string, string[] | undefined>;
}): string;
type AdminJobRow = {
    job: Job;
    company: Company;
    applicationCount: number;
};
type AdminAppRow = {
    application: Application;
    job: Job;
    company: Company;
};
export declare function adminPage(p: {
    pending: AdminJobRow[];
    open: AdminJobRow[];
    closed: AdminJobRow[];
    applications: AdminAppRow[];
    emails: EmailLog[];
    stats: {
        pending: number;
        open: number;
        closed: number;
        applications: number;
        emails: number;
    };
}): string;
export declare function notFoundPage(): string;
export {};
//# sourceMappingURL=admin.d.ts.map