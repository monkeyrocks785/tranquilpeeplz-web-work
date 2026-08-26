import { z } from "zod";
/**
 * Shared business logic. Used by:
 *   - the site forms (server actions in src/app/actions/*)
 *   - the public Node API routes (src/app/api/jobs, src/app/api/applications)
 */
export declare const jobSchema: z.ZodObject<{
    contactName: z.ZodString;
    contactEmail: z.ZodString;
    companyName: z.ZodString;
    companyWebsite: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    title: z.ZodString;
    industry: z.ZodString;
    location: z.ZodString;
    workMode: z.ZodEnum<{
        "on-site": "on-site";
        hybrid: "hybrid";
        remote: "remote";
    }>;
    employmentType: z.ZodEnum<{
        "full-time": "full-time";
        contract: "contract";
        "part-time": "part-time";
        temporary: "temporary";
    }>;
    experienceMin: z.ZodCoercedNumber<unknown>;
    experienceMax: z.ZodCoercedNumber<unknown>;
    salaryMin: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    salaryMax: z.ZodUnion<[z.ZodOptional<z.ZodCoercedNumber<unknown>>, z.ZodLiteral<"">]>;
    openings: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    summary: z.ZodString;
    description: z.ZodString;
    responsibilities: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    requirements: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    skills: z.ZodString;
}, z.core.$strip>;
export declare const applicationSchema: z.ZodObject<{
    jobId: z.ZodString;
    applicantName: z.ZodString;
    applicantEmail: z.ZodString;
    applicantPhone: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    resumeUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    coverNote: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
}, z.core.$strip>;
export type SubmitJobResult = {
    ok: true;
    jobId: string;
    companyName: string;
} | {
    ok: false;
    message: string;
    errors?: Record<string, string[]>;
};
/** Employer submits a role → goes to the admin queue as `pending` + thank-you email. */
export declare function submitJobForReview(input: unknown): Promise<SubmitJobResult>;
/**
 * Send approval notification to employer when job is approved.
 */
export declare function sendJobApprovedEmail(jobId: string, contactEmail: string, contactName: string, title: string, companyName: string): Promise<{
    delivered: boolean;
}>;
/**
 * Send confirmation email to job seeker after applying.
 */
export declare function sendApplicationConfirmationEmail(jobId: string, applicantEmail: string, applicantName: string, jobTitle: string, companyName: string): Promise<{
    delivered: boolean;
}>;
/**
 * Send notification to admin when a new job is submitted for approval.
 */
export declare function sendNewJobPendingEmail(jobId: string, title: string, companyName: string, contactName: string, contactEmail: string, industry: string, location: string, workMode: string, employmentType: string): Promise<{
    delivered: boolean;
}>;
export type SubmitApplicationResult = {
    ok: true;
    message: string;
} | {
    ok: false;
    message: string;
    errors?: Record<string, string[]>;
};
/** Job seeker applies → stored + owner's inbox gets the details as a CSV attachment. */
export declare function submitJobApplication(input: unknown): Promise<SubmitApplicationResult>;
//# sourceMappingURL=jobs-service.d.ts.map