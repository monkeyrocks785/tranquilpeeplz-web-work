import { z } from "zod";
import { and, eq, ilike } from "drizzle-orm";
import { db } from "../db";
import { applications, companies, jobs } from "../db/schema";
import { sendEmail, toCsv, OWNER_EMAIL } from "./email";
import { slugify } from "./utils";
/**
 * Shared business logic. Used by:
 *   - the site forms (server actions in src/app/actions/*)
 *   - the public Node API routes (src/app/api/jobs, src/app/api/applications)
 */
export const jobSchema = z.object({
    contactName: z.string().trim().min(2, "Enter the recruiter's name").max(160),
    contactEmail: z
        .string()
        .trim()
        .toLowerCase()
        .email("Enter a valid work email"),
    companyName: z.string().trim().min(2, "Enter the company name").max(180),
    companyWebsite: z
        .string()
        .trim()
        .url("Enter a valid URL (https://…)")
        .optional()
        .or(z.literal("")),
    title: z.string().trim().min(4, "Give the role a clear title").max(180),
    industry: z.string().trim().min(2, "Pick an industry").max(120),
    location: z.string().trim().min(2, "Add a location").max(160),
    workMode: z.enum(["on-site", "hybrid", "remote"]),
    employmentType: z.enum(["full-time", "contract", "part-time", "temporary"]),
    experienceMin: z.coerce.number().int().min(0).max(30),
    experienceMax: z.coerce.number().int().min(0).max(40),
    salaryMin: z.coerce.number().int().min(0).max(500).optional(),
    salaryMax: z.coerce.number().int().max(500).optional().or(z.literal("")),
    openings: z.coerce.number().int().min(1).max(200).default(1),
    summary: z
        .string()
        .trim()
        .min(20, "Summarise the role in a sentence or two")
        .max(400),
    description: z
        .string()
        .trim()
        .min(40, "Describe the role in more detail")
        .max(8000),
    responsibilities: z.string().trim().max(4000).optional().or(z.literal("")),
    requirements: z.string().trim().max(4000).optional().or(z.literal("")),
    skills: z.string().trim().min(2, "Add a few key skills").max(600),
});
export const applicationSchema = z.object({
    jobId: z.string().uuid(),
    applicantName: z.string().trim().min(2, "Enter your full name").max(160),
    applicantEmail: z
        .string()
        .trim()
        .toLowerCase()
        .email("Enter a valid email address"),
    applicantPhone: z.string().trim().max(40).optional().or(z.literal("")),
    resumeUrl: z
        .string()
        .trim()
        .url("Paste a valid link (Google Drive, Dropbox, LinkedIn…)")
        .optional()
        .or(z.literal("")),
    coverNote: z.string().trim().max(2000).optional().or(z.literal("")),
});
function linesToArray(raw) {
    if (!raw)
        return [];
    return raw
        .split("\n")
        .map((s) => s.replace(/^[-•*]\s*/, "").trim())
        .filter(Boolean)
        .slice(0, 20);
}
/** Employer submits a role → goes to the admin queue as `pending` + thank-you email. */
export async function submitJobForReview(input) {
    const parsed = jobSchema.safeParse(input);
    if (!parsed.success) {
        return {
            ok: false,
            message: "Please fix the highlighted fields.",
            errors: parsed.error.flatten().fieldErrors,
        };
    }
    const d = parsed.data;
    if (d.experienceMax < d.experienceMin) {
        return {
            ok: false,
            message: "Maximum experience must be greater than the minimum.",
            errors: { experienceMax: ["Must be ≥ minimum experience"] },
        };
    }
    if (typeof d.salaryMin === "number" &&
        typeof d.salaryMax === "number" &&
        d.salaryMax < d.salaryMin) {
        return {
            ok: false,
            message: "Maximum salary must be greater than the minimum.",
            errors: { salaryMax: ["Must be ≥ minimum salary"] },
        };
    }
    // Match an existing company by name (case-insensitive) or create it.
    const existing = await db
        .select()
        .from(companies)
        .where(ilike(companies.name, d.companyName.trim()))
        .limit(1);
    let companyId;
    if (existing[0]) {
        companyId = existing[0].id;
    }
    else {
        const [created] = await db
            .insert(companies)
            .values({
            name: d.companyName.trim(),
            industry: d.industry,
            location: d.location,
            website: d.companyWebsite || null,
        })
            .returning({ id: companies.id });
        companyId = created.id;
    }
    const slug = `${slugify(d.title) || "role"}-${Math.random().toString(36).slice(2, 7)}`;
    const [job] = await db
        .insert(jobs)
        .values({
        companyId,
        contactName: d.contactName,
        contactEmail: d.contactEmail,
        title: d.title,
        slug,
        industry: d.industry,
        location: d.location,
        workMode: d.workMode,
        employmentType: d.employmentType,
        experienceMin: d.experienceMin,
        experienceMax: d.experienceMax,
        salaryMin: typeof d.salaryMin === "number" ? d.salaryMin : null,
        salaryMax: typeof d.salaryMax === "number" ? d.salaryMax : null,
        summary: d.summary,
        description: d.description,
        responsibilities: linesToArray(d.responsibilities),
        requirements: linesToArray(d.requirements),
        skills: d.skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
            .slice(0, 20),
        openings: d.openings,
        status: "pending",
    })
        .returning({ id: jobs.id });
    // Thank-you email to the recruiter (goes to the outbox first — never lost).
    await sendEmail({
        kind: "job_thank_you",
        to: d.contactEmail,
        subject: `We received your role: ${d.title}`,
        body: [
            `Hi ${d.contactName.trim().split(" ")[0]},`,
            "",
            `Thank you for posting "${d.title}" at ${d.companyName.trim()} with Tranquil Peeplz.`,
            "",
            "Your role is now with our team for review. We typically approve postings within one business day, and it will appear on our job board as soon as it's approved.",
            "",
            "If we need anything clarified, we'll reach out on this email address.",
            "",
            "Warm regards,",
            "Tranquil Peeplz — Recruitment Consultancy, Bangalore",
            "contact@tranquilpeeplz.com · +91 80 4979 3366",
        ].join("\n"),
    });
    // Notify admin of new pending job
    await sendNewJobPendingEmail(job.id, d.title, d.companyName.trim(), d.contactName, d.contactEmail, d.industry, d.location, d.workMode, d.employmentType);
    return {
        ok: true,
        jobId: job.id,
        companyName: d.companyName.trim()
    };
}
/**
 * Send approval notification to employer when job is approved.
 */
export async function sendJobApprovedEmail(jobId, contactEmail, contactName, title, companyName) {
    return sendEmail({
        kind: "job_approved",
        to: contactEmail,
        subject: `Your role "${title}" is now live!`,
        body: [
            `Hi ${contactName.trim().split(" ")[0]},`,
            "",
            `Great news! Your role "${title}" at ${companyName.trim()} has been approved and is now live on the Tranquil Peeplz job board.`,
            "",
            "You can view it here: https://tranquilpeeplz.com/job-search",
            "",
            "Our team will actively source candidates and reach out with matches.",
            "",
            "Warm regards,",
            "Tranquil Peeplz — Recruitment Consultancy, Bangalore",
            "contact@tranquilpeeplz.com · +91 80 4979 3366",
        ].join("\n"),
    });
}
/**
 * Send confirmation email to job seeker after applying.
 */
export async function sendApplicationConfirmationEmail(jobId, applicantEmail, applicantName, jobTitle, companyName) {
    return sendEmail({
        kind: "application_received",
        to: applicantEmail,
        subject: `Application received — ${jobTitle} at ${companyName}`,
        body: [
            `Hi ${applicantName.trim().split(" ")[0]},`,
            "",
            `Thank you for applying to "${jobTitle}" at ${companyName.trim()} through Tranquil Peeplz.`,
            "",
            "We've received your application and our recruitment team will review it shortly.",
            "If your profile matches the role requirements, a recruiter will contact you directly.",
            "",
            "You can browse more opportunities here: https://tranquilpeeplz.com/job-search",
            "",
            "Best regards,",
            "Tranquil Peeplz — Recruitment Consultancy, Bangalore",
            "contact@tranquilpeeplz.com · +91 80 4979 3366",
        ].join("\n"),
    });
}
/**
 * Send notification to admin when a new job is submitted for approval.
 */
export async function sendNewJobPendingEmail(jobId, title, companyName, contactName, contactEmail, industry, location, workMode, employmentType) {
    return sendEmail({
        kind: "new_job_pending",
        to: OWNER_EMAIL,
        subject: `New job pending approval — ${title} (${companyName})`,
        body: [
            `A new job has been submitted for approval:`,
            "",
            `Title: ${title}`,
            `Company: ${companyName}`,
            `Industry: ${industry}`,
            `Location: ${location}`,
            `Work Mode: ${workMode}`,
            `Employment Type: ${employmentType}`,
            `Contact: ${contactName} (${contactEmail})`,
            "",
            "Review and approve in the admin dashboard: https://tranquilpeeplz.com/admin",
            "",
            "— Tranquil Peeplz System",
        ].join("\n"),
    });
}
/** Job seeker applies → stored + owner's inbox gets the details as a CSV attachment. */
export async function submitJobApplication(input) {
    const parsed = applicationSchema.safeParse(input);
    if (!parsed.success) {
        return {
            ok: false,
            message: "Please fix the highlighted fields.",
            errors: parsed.error.flatten().fieldErrors,
        };
    }
    const d = parsed.data;
    const rows = await db
        .select({
        job: jobs,
        companyName: companies.name,
    })
        .from(jobs)
        .innerJoin(companies, eq(jobs.companyId, companies.id))
        .where(and(eq(jobs.id, d.jobId), eq(jobs.status, "open")))
        .limit(1);
    const row = rows[0];
    if (!row) {
        return { ok: false, message: "This role is no longer accepting applications." };
    }
    const [application] = await db
        .insert(applications)
        .values({
        jobId: d.jobId,
        applicantName: d.applicantName,
        applicantEmail: d.applicantEmail,
        applicantPhone: d.applicantPhone || null,
        resumeUrl: d.resumeUrl || null,
        coverNote: d.coverNote || null,
    })
        .returning({ id: applications.id, createdAt: applications.createdAt });
    // Owner notification: applicant details as a CSV attachment.
    const csv = toCsv([
        "Application ID",
        "Applied At",
        "Job Title",
        "Company",
        "Applicant Name",
        "Applicant Email",
        "Applicant Phone",
        "Resume URL",
        "Cover Note",
    ], [
        [
            application.id,
            application.createdAt.toISOString(),
            row.job.title,
            row.companyName,
            d.applicantName,
            d.applicantEmail,
            d.applicantPhone || "",
            d.resumeUrl || "",
            d.coverNote || "",
        ],
    ]);
    await sendEmail({
        kind: "new_application_owner",
        to: OWNER_EMAIL,
        subject: `New application — ${row.job.title} (${row.companyName})`,
        body: [
            `A new application just came in for "${row.job.title}" at ${row.companyName}.`,
            "",
            `Name:  ${d.applicantName}`,
            `Email: ${d.applicantEmail}`,
            `Phone: ${d.applicantPhone || "—"}`,
            `Résumé: ${d.resumeUrl || "—"}`,
            "",
            d.coverNote ? `Note from candidate:\n${d.coverNote}` : "No cover note provided.",
            "",
            "The applicant's details are attached as a CSV file. The full pipeline is in the admin dashboard (/admin).",
        ].join("\n"),
        csvAttachment: {
            filename: `application-${application.id.slice(0, 8)}.csv`,
            content: csv,
        },
    });
    // Send confirmation email to applicant
    await sendApplicationConfirmationEmail(application.id, d.applicantEmail, d.applicantName, row.job.title, row.companyName);
    return {
        ok: true,
        message: "Application sent — our recruiters have your details and will reach out directly.",
    };
}
//# sourceMappingURL=jobs-service.js.map