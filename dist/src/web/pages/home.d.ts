import type { Job, Company, BlogPost } from "../../db/schema.js";
export declare function homePage(p: {
    featured: {
        job: Job;
        company: Company;
    }[];
    posts: BlogPost[];
    openJobs: number;
}): string;
//# sourceMappingURL=home.d.ts.map