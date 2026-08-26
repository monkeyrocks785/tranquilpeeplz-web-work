import type { Company, Job } from "../../db/schema";
export declare function jobCard(job: Job, company: Company): string;
export declare function jobSearchPage(p: {
    results: {
        job: Job;
        company: Company;
    }[];
    locations: string[];
    industries: string[];
    filters: {
        q?: string;
        industry?: string;
        location?: string;
        type?: string;
        mode?: string;
    };
}): string;
export declare function applyForm(p: {
    jobId: string;
    success?: boolean;
    message?: string;
    errors?: Record<string, string[] | undefined>;
    values?: Record<string, string>;
}): string;
export declare function jobDetailPage(p: {
    job: Job;
    company: Company;
    similar: {
        job: Job;
        company: Company;
    }[];
    applied?: boolean;
    applyMessage?: string;
    applyErrors?: Record<string, string[] | undefined>;
    applyValues?: Record<string, string>;
}): string;
export declare function postJobPage(p: {
    industries: string[];
    success?: boolean;
    message?: string;
    errors?: Record<string, string[] | undefined>;
    values?: Record<string, string>;
}): string;
//# sourceMappingURL=jobs.d.ts.map