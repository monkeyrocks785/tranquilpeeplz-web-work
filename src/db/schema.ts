import {
  pgTable,
  pgEnum,
  uuid,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

/**
 * Job lifecycle:
 *   pending → submitted by an employer via /post-a-job, awaiting admin approval
 *   open    → approved by the site owner, visible on /job-search
 *   closed  → rejected or taken down; hidden from the board
 */
export const jobStatusEnum = pgEnum("job_status", ["pending", "open", "closed"]);

export const applicationStatusEnum = pgEnum("application_status", [
  "applied",
  "reviewing",
  "interview",
  "offered",
  "rejected",
]);

export const employmentTypeEnum = pgEnum("employment_type", [
  "full-time",
  "contract",
  "part-time",
  "temporary",
]);

export const workModeEnum = pgEnum("work_mode", ["on-site", "hybrid", "remote"]);

/**
 * Companies are matched by name when an employer submits a job, or created
 * on the fly. No accounts — purely presentational.
 */
export const companies = pgTable("companies", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 180 }).notNull(),
  website: varchar("website", { length: 220 }),
  industry: varchar("industry", { length: 120 }),
  size: varchar("size", { length: 60 }),
  location: varchar("location", { length: 160 }),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const jobs = pgTable(
  "jobs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    // Recruiter contact — receives the submission thank-you email.
    contactName: varchar("contact_name", { length: 160 }).notNull(),
    contactEmail: varchar("contact_email", { length: 220 }).notNull(),
    title: varchar("title", { length: 180 }).notNull(),
    slug: varchar("slug", { length: 220 }).notNull().unique(),
    industry: varchar("industry", { length: 120 }).notNull(),
    location: varchar("location", { length: 160 }).notNull(),
    workMode: workModeEnum("work_mode").notNull().default("on-site"),
    employmentType: employmentTypeEnum("employment_type")
      .notNull()
      .default("full-time"),
    experienceMin: integer("experience_min").notNull().default(0),
    experienceMax: integer("experience_max").notNull().default(2),
    salaryMin: integer("salary_min"), // INR lakhs per annum
    salaryMax: integer("salary_max"),
    summary: text("summary").notNull(),
    description: text("description").notNull(),
    responsibilities: text("responsibilities")
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
    requirements: text("requirements")
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
    skills: text("skills")
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
    openings: integer("openings").notNull().default(1),
    featured: boolean("featured").notNull().default(false),
    status: jobStatusEnum("status").notNull().default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("jobs_status_idx").on(t.status),
    index("jobs_industry_idx").on(t.industry),
    index("jobs_company_idx").on(t.companyId),
  ],
);

/** Anonymous job-seeker applications — no account required. */
export const applications = pgTable(
  "applications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    jobId: uuid("job_id")
      .notNull()
      .references(() => jobs.id, { onDelete: "cascade" }),
    applicantName: varchar("applicant_name", { length: 160 }).notNull(),
    applicantEmail: varchar("applicant_email", { length: 220 }).notNull(),
    applicantPhone: varchar("applicant_phone", { length: 40 }),
    resumeUrl: text("resume_url"),
    coverNote: text("cover_note"),
    status: applicationStatusEnum("status").notNull().default("applied"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("applications_job_idx").on(t.jobId)],
);

export const contactMessages = pgTable("contact_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 160 }).notNull(),
  email: varchar("email", { length: 220 }).notNull(),
  phone: varchar("phone", { length: 40 }),
  topic: varchar("topic", { length: 80 }).notNull().default("general"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const blogPosts = pgTable("blog_posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 220 }).notNull().unique(),
  title: varchar("title", { length: 220 }).notNull(),
  excerpt: text("excerpt").notNull(),
  category: varchar("category", { length: 80 }).notNull(),
  coverImage: text("cover_image"),
  readMinutes: integer("read_minutes").notNull().default(4),
  authorName: varchar("author_name", { length: 120 }).notNull(),
  content: text("content").notNull(),
  publishedAt: timestamp("published_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * Email outbox: every email the app tries to send is recorded here first,
 * so nothing is ever lost — even when SMTP is not configured yet.
 */
export const emailLogs = pgTable("email_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  kind: varchar("kind", { length: 40 }).notNull(), // job_thank_you | new_application_owner
  toEmail: varchar("to_email", { length: 220 }).notNull(),
  subject: varchar("subject", { length: 300 }).notNull(),
  body: text("body").notNull(),
  csvPayload: text("csv_payload"), // CSV attachment contents, when any
  status: varchar("status", { length: 20 }).notNull().default("queued"), // queued | sent | failed
  error: text("error"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Job = typeof jobs.$inferSelect;
export type Company = typeof companies.$inferSelect;
export type Application = typeof applications.$inferSelect;
export type BlogPost = typeof blogPosts.$inferSelect;
export type EmailLog = typeof emailLogs.$inferSelect;
