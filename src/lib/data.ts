import { cache } from "react";
import { db } from "../db";
import {
  jobs,
  companies,
  applications,
  blogPosts,
  emailLogs,
} from "../db/schema";
import {
  and,
  desc,
  eq,
  ilike,
  or,
  sql,
  asc,
  count,
  ne,
} from "drizzle-orm";

export const INDUSTRIES = [
  "IT & Software",
  "Healthcare",
  "Finance & Banking",
  "Manufacturing",
  "E-commerce & Retail",
  "Education",
  "Hospitality & Travel",
  "Advertising & Media",
] as const;

export type JobFilters = {
  q?: string;
  industry?: string;
  location?: string;
  type?: string;
  mode?: string;
};

/** The public board only ever shows admin-approved (`open`) roles. */
export async function listJobs(filters: JobFilters = {}) {
  const conditions = [eq(jobs.status, "open" as const)];
  if (filters.q) {
    const q = `%${filters.q}%`;
    conditions.push(
      or(
        ilike(jobs.title, q),
        ilike(jobs.summary, q),
        ilike(companies.name, q),
        sql`exists (select 1 from unnest(${jobs.skills}) s where s ilike ${q})`,
      )!,
    );
  }
  if (filters.industry) conditions.push(eq(jobs.industry, filters.industry));
  if (filters.location)
    conditions.push(ilike(jobs.location, `%${filters.location}%`));
  if (filters.type)
    conditions.push(
      eq(
        jobs.employmentType,
        filters.type as (typeof jobs.employmentType.enumValues)[number],
      ),
    );
  if (filters.mode)
    conditions.push(
      eq(jobs.workMode, filters.mode as (typeof jobs.workMode.enumValues)[number]),
    );

  return db
    .select({ job: jobs, company: companies })
    .from(jobs)
    .innerJoin(companies, eq(jobs.companyId, companies.id))
    .where(and(...conditions))
    .orderBy(desc(jobs.featured), desc(jobs.createdAt))
    .limit(60);
}

export const getJobBySlug = cache(async (slug: string) => {
  const rows = await db
    .select({ job: jobs, company: companies })
    .from(jobs)
    .innerJoin(companies, eq(jobs.companyId, companies.id))
    .where(eq(jobs.slug, slug))
    .limit(1);
  return rows[0] ?? null;
});

export async function getSimilarJobs(industry: string, excludeId: string) {
  return db
    .select({ job: jobs, company: companies })
    .from(jobs)
    .innerJoin(companies, eq(jobs.companyId, companies.id))
    .where(
      and(
        eq(jobs.industry, industry),
        eq(jobs.status, "open"),
        sql`${jobs.id} <> ${excludeId}`,
      ),
    )
    .orderBy(desc(jobs.createdAt))
    .limit(3);
}

export async function listFeaturedJobs(limit = 4) {
  return db
    .select({ job: jobs, company: companies })
    .from(jobs)
    .innerJoin(companies, eq(jobs.companyId, companies.id))
    .where(eq(jobs.status, "open"))
    .orderBy(desc(jobs.featured), desc(jobs.createdAt))
    .limit(limit);
}

export async function listJobLocations() {
  const rows = await db
    .selectDistinct({ location: jobs.location })
    .from(jobs)
    .where(eq(jobs.status, "open"))
    .orderBy(asc(jobs.location));
  return rows.map((r) => r.location);
}

// ------------------------------- Admin -------------------------------

export async function listAdminJobs(status: "pending" | "open" | "closed") {
  const rows = await db
    .select({
      job: jobs,
      company: companies,
      applicationCount: count(applications.id),
    })
    .from(jobs)
    .innerJoin(companies, eq(jobs.companyId, companies.id))
    .leftJoin(applications, eq(applications.jobId, jobs.id))
    .where(eq(jobs.status, status))
    .groupBy(jobs.id, companies.id)
    .orderBy(desc(jobs.createdAt));
  return rows;
}

export async function getAdminStats() {
  const statuses = ["pending", "open", "closed"] as const;
  const out: Record<(typeof statuses)[number], number> = {
    pending: 0,
    open: 0,
    closed: 0,
  };
  for (const s of statuses) {
    const [r] = await db.select({ value: count() }).from(jobs).where(eq(jobs.status, s));
    out[s] = r?.value ?? 0;
  }
  const [apps] = await db.select({ value: count() }).from(applications);
  const [msgs] = await db.select({ value: count() }).from(emailLogs);
  return { ...out, applications: apps?.value ?? 0, emails: msgs?.value ?? 0 };
}

export async function listAllApplications() {
  return db
    .select({ application: applications, job: jobs, company: companies })
    .from(applications)
    .innerJoin(jobs, eq(applications.jobId, jobs.id))
    .innerJoin(companies, eq(jobs.companyId, companies.id))
    .orderBy(desc(applications.createdAt))
    .limit(200);
}

export async function listEmailLogs(limit = 12) {
  return db
    .select()
    .from(emailLogs)
    .orderBy(desc(emailLogs.createdAt))
    .limit(limit);
}

// ------------------------------- Blog --------------------------------

export async function listBlogPosts() {
  return db.select().from(blogPosts).orderBy(desc(blogPosts.publishedAt));
}

export const getBlogPostBySlug = cache(async (slug: string) => {
  const rows = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.slug, slug))
    .limit(1);
  return rows[0] ?? null;
});

// ------------------------------- Misc --------------------------------

export async function getPublicStats() {
  const [openJobs] = await db
    .select({ value: count() })
    .from(jobs)
    .where(ne(jobs.status, "closed"));
  const [companyCount] = await db.select({ value: count() }).from(companies);
  return { openJobs: openJobs?.value ?? 0, companies: companyCount?.value ?? 0 };
}
