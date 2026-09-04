import type { Job, Company } from "../../db/schema.js";
export declare function aboutPage(): string;
export declare function forEmployerPage(): string;
export declare function forJobSeekerPage(p: {
    featured: {
        job: Job;
        company: Company;
    }[];
}): string;
export type ServicePageConfig = {
    path: string;
    metaTitle: string;
    eyebrow: string;
    title: string;
    intro: string;
    image: string;
    imageAlt: string;
    stat: {
        value: string;
        label: string;
    };
    offerings: {
        icon: string;
        title: string;
        copy: string;
    }[];
    bullets: string[];
    steps: {
        nr: string;
        title: string;
        copy: string;
    }[];
    ctaTitle: string;
    ctaCopy: string;
};
export declare const SERVICE_PAGES: ServicePageConfig[];
export declare function servicePage(c: ServicePageConfig): string;
export declare function contactPage(p?: {
    success?: boolean;
    message?: string;
    errors?: Record<string, string[] | undefined>;
    values?: Record<string, string>;
}): string;
export declare function privacyPage(): string;
//# sourceMappingURL=marketing.d.ts.map