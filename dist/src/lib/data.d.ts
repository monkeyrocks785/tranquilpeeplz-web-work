import { jobs, companies } from "../db/schema";
export declare const INDUSTRIES: readonly ["IT & Software", "Healthcare", "Finance & Banking", "Manufacturing", "E-commerce & Retail", "Education", "Hospitality & Travel", "Advertising & Media"];
export type JobFilters = {
    q?: string;
    industry?: string;
    location?: string;
    type?: string;
    mode?: string;
};
/** The public board only ever shows admin-approved (`open`) roles. */
export declare function listJobs(filters?: JobFilters): Promise<{
    job: {
        id: string;
        companyId: string;
        contactName: string;
        contactEmail: string;
        title: string;
        slug: string;
        industry: string;
        location: string;
        workMode: "on-site" | "hybrid" | "remote";
        employmentType: "full-time" | "contract" | "part-time" | "temporary";
        experienceMin: number;
        experienceMax: number;
        salaryMin: number | null;
        salaryMax: number | null;
        summary: string;
        description: string;
        responsibilities: string[];
        requirements: string[];
        skills: string[];
        openings: number;
        featured: boolean;
        status: "pending" | "open" | "closed";
        createdAt: Date;
    };
    company: {
        id: string;
        name: string;
        website: string | null;
        industry: string | null;
        size: string | null;
        location: string | null;
        description: string | null;
        createdAt: Date;
    };
}[]>;
export declare const getJobBySlug: (slug: string) => Promise<{
    job: typeof jobs.$inferSelect;
    company: typeof companies.$inferSelect;
} | null>;
export declare function getSimilarJobs(industry: string, excludeId: string): Promise<{
    job: {
        id: string;
        companyId: string;
        contactName: string;
        contactEmail: string;
        title: string;
        slug: string;
        industry: string;
        location: string;
        workMode: "on-site" | "hybrid" | "remote";
        employmentType: "full-time" | "contract" | "part-time" | "temporary";
        experienceMin: number;
        experienceMax: number;
        salaryMin: number | null;
        salaryMax: number | null;
        summary: string;
        description: string;
        responsibilities: string[];
        requirements: string[];
        skills: string[];
        openings: number;
        featured: boolean;
        status: "pending" | "open" | "closed";
        createdAt: Date;
    };
    company: {
        id: string;
        name: string;
        website: string | null;
        industry: string | null;
        size: string | null;
        location: string | null;
        description: string | null;
        createdAt: Date;
    };
}[]>;
export declare function listFeaturedJobs(limit?: number): Promise<{
    job: {
        id: string;
        companyId: string;
        contactName: string;
        contactEmail: string;
        title: string;
        slug: string;
        industry: string;
        location: string;
        workMode: "on-site" | "hybrid" | "remote";
        employmentType: "full-time" | "contract" | "part-time" | "temporary";
        experienceMin: number;
        experienceMax: number;
        salaryMin: number | null;
        salaryMax: number | null;
        summary: string;
        description: string;
        responsibilities: string[];
        requirements: string[];
        skills: string[];
        openings: number;
        featured: boolean;
        status: "pending" | "open" | "closed";
        createdAt: Date;
    };
    company: {
        id: string;
        name: string;
        website: string | null;
        industry: string | null;
        size: string | null;
        location: string | null;
        description: string | null;
        createdAt: Date;
    };
}[]>;
export declare function listJobLocations(): Promise<string[]>;
export declare function listAdminJobs(status: "pending" | "open" | "closed"): Promise<{
    job: {
        id: string;
        companyId: string;
        contactName: string;
        contactEmail: string;
        title: string;
        slug: string;
        industry: string;
        location: string;
        workMode: "on-site" | "hybrid" | "remote";
        employmentType: "full-time" | "contract" | "part-time" | "temporary";
        experienceMin: number;
        experienceMax: number;
        salaryMin: number | null;
        salaryMax: number | null;
        summary: string;
        description: string;
        responsibilities: string[];
        requirements: string[];
        skills: string[];
        openings: number;
        featured: boolean;
        status: "pending" | "open" | "closed";
        createdAt: Date;
    };
    company: {
        id: string;
        name: string;
        website: string | null;
        industry: string | null;
        size: string | null;
        location: string | null;
        description: string | null;
        createdAt: Date;
    };
    applicationCount: number;
}[]>;
export declare function getAdminStats(): Promise<{
    applications: number;
    emails: number;
    pending: number;
    open: number;
    closed: number;
}>;
export declare function listAllApplications(): Promise<{
    application: {
        id: string;
        jobId: string;
        applicantName: string;
        applicantEmail: string;
        applicantPhone: string | null;
        resumeUrl: string | null;
        coverNote: string | null;
        status: "applied" | "reviewing" | "interview" | "offered" | "rejected";
        createdAt: Date;
    };
    job: {
        id: string;
        companyId: string;
        contactName: string;
        contactEmail: string;
        title: string;
        slug: string;
        industry: string;
        location: string;
        workMode: "on-site" | "hybrid" | "remote";
        employmentType: "full-time" | "contract" | "part-time" | "temporary";
        experienceMin: number;
        experienceMax: number;
        salaryMin: number | null;
        salaryMax: number | null;
        summary: string;
        description: string;
        responsibilities: string[];
        requirements: string[];
        skills: string[];
        openings: number;
        featured: boolean;
        status: "pending" | "open" | "closed";
        createdAt: Date;
    };
    company: {
        id: string;
        name: string;
        website: string | null;
        industry: string | null;
        size: string | null;
        location: string | null;
        description: string | null;
        createdAt: Date;
    };
}[]>;
export declare function listEmailLogs(limit?: number): Promise<{
    id: string;
    kind: string;
    toEmail: string;
    subject: string;
    body: string;
    csvPayload: string | null;
    status: string;
    error: string | null;
    createdAt: Date;
}[]>;
export declare function listBlogPosts(): Promise<{
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    coverImage: string | null;
    readMinutes: number;
    authorName: string;
    content: string;
    publishedAt: Date;
}[]>;
export declare const getBlogPostBySlug: (slug: string) => Promise<{
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    coverImage: string | null;
    readMinutes: number;
    authorName: string;
    content: string;
    publishedAt: Date;
} | null>;
export declare function getPublicStats(): Promise<{
    openJobs: number;
    companies: number;
}>;
//# sourceMappingURL=data.d.ts.map