import express, { type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { page, esc } from "./web/html";
import { homePage } from "./web/pages/home";
import {
  aboutPage,
  contactPage,
  forEmployerPage,
  forJobSeekerPage,
  privacyPage,
  servicePage,
  SERVICE_PAGES,
} from "./web/pages/marketing";
import { jobDetailPage, jobSearchPage, postJobPage } from "./web/pages/jobs";
import { blogPage, blogPostPage } from "./web/pages/blog";
import { adminLoginPage, adminPage, notFoundPage } from "./web/pages/admin";
import {
  INDUSTRIES,
  getAdminStats,
  getBlogPostBySlug,
  getJobBySlug,
  getPublicStats,
  getSimilarJobs,
  listAdminJobs,
  listAllApplications,
  listBlogPosts,
  listEmailLogs,
  listFeaturedJobs,
  listJobLocations,
  listJobs,
  listAllApplications as listAppsRaw,
} from "./lib/data";
import { submitJobApplication, submitJobForReview, sendJobApprovedEmail } from "./lib/jobs-service";
import { ensureDatabase } from "./db/bootstrap";
import { seedIfEmpty } from "./db/seed";
import { db } from "./db";
import { jobs, contactMessages, applications as applicationsTable, companies } from "./db/schema";
import { eq, sql } from "drizzle-orm";
import { and } from "drizzle-orm";
import { ADMIN_COOKIE, adminPasscode, adminToken, isAdmin } from "./lib/admin";
import { toCsv, OWNER_EMAIL } from "./lib/email";

export const app = express();

app.disable("x-powered-by");
app.use(express.urlencoded({ extended: true, limit: "256kb" }));
app.use(express.json({ limit: "256kb" }));
app.use(express.static("public", { maxAge: "1h", index: false }));

// Run schema+seed bootstrap once (promise-memoised inside ensureDatabase).
app.use((_req: Request, _res: Response, next: NextFunction) => {
  void ensureDatabase().then(() => next(), () => next());
});

const ADMIN_DAYS = 30 * 24 * 60 * 60;

function send(res: Response, title: string, path: string, body: string, description?: string) {
  res.type("html").send(page({ title, path, body, description }));
}

function fieldValues(body: Record<string, unknown>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(body)) {
    if (typeof v === "string") out[k] = v;
  }
  return out;
}

function asyncRoute(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}

// ---------------------------------- Pages ----------------------------------

app.get("/", asyncRoute(async (_req, res) => {
  const [featured, posts, stats] = await Promise.all([
    listFeaturedJobs(4),
    listBlogPosts(),
    getPublicStats(),
  ]);
  send(res, "Tranquil Peeplz — Recruitment Consultancy in Bangalore", "/", homePage({ featured, posts, openJobs: stats.openJobs }));
}));

app.get("/about-us", (_req, res) => {
  send(res, "About Us · Tranquil Peeplz", "/about-us", aboutPage());
});

app.get("/for-employer", (_req, res) => {
  send(res, "For Employers · Tranquil Peeplz", "/for-employer", forEmployerPage());
});

app.get("/for-job-seeker", asyncRoute(async (_req, res) => {
  const featured = await listFeaturedJobs(3);
  send(res, "For Job Seekers · Tranquil Peeplz", "/for-job-seeker", forJobSeekerPage({ featured }));
}));

for (const cfg of SERVICE_PAGES) {
  app.get(cfg.path, (_req, res) => {
    send(res, `${cfg.metaTitle} · Tranquil Peeplz`, cfg.path, servicePage(cfg));
  });
}

app.get("/privacy-policy", (_req, res) => {
  send(res, "Privacy Policy · Tranquil Peeplz", "/privacy-policy", privacyPage());
});

// -------------------------------- Jobs board --------------------------------

app.get("/job-search", asyncRoute(async (req, res) => {
  const filters = {
    q: typeof req.query.q === "string" ? req.query.q.trim() || undefined : undefined,
    industry: typeof req.query.industry === "string" ? req.query.industry || undefined : undefined,
    location: typeof req.query.location === "string" ? req.query.location || undefined : undefined,
    type: typeof req.query.type === "string" ? req.query.type || undefined : undefined,
    mode: typeof req.query.mode === "string" ? req.query.mode || undefined : undefined,
  };
  const [results, locations] = await Promise.all([listJobs(filters), listJobLocations()]);
  send(res, "Job Search · Tranquil Peeplz", "/job-search", jobSearchPage({ results, locations, industries: [...INDUSTRIES], filters }));
}));

app.get("/jobs/:slug", asyncRoute(async (req, res, next) => {
  const row = await getJobBySlug(String(req.params.slug));
  if (!row || row.job.status !== "open") return next();
  const similar = await getSimilarJobs(row.job.industry, row.job.id);
  send(res, `${row.job.title} at ${row.company.name} · Tranquil Peeplz`, "/job-search", jobDetailPage({ job: row.job, company: row.company, similar }), row.job.summary);
}));

app.post("/jobs/:slug", asyncRoute(async (req, res, next) => {
  if (req.query.apply !== "1") return next();
  const row = await getJobBySlug(String(req.params.slug));
  if (!row || row.job.status !== "open") return next();
  const similar = await getSimilarJobs(row.job.industry, row.job.id);
  const values = fieldValues(req.body as Record<string, unknown>);
  const result = await submitJobApplication({
    jobId: row.job.id,
    applicantName: req.body.applicantName,
    applicantEmail: req.body.applicantEmail,
    applicantPhone: req.body.applicantPhone,
    resumeUrl: req.body.resumeUrl,
    coverNote: req.body.coverNote,
  });
  if (result.ok) {
    return send(res, "Application sent · Tranquil Peeplz", "/job-search",
      jobDetailPage({ job: row.job, company: row.company, similar, applied: true, applyMessage: result.message }));
  }
  send(res, `${row.job.title} · Tranquil Peeplz`, "/job-search",
    jobDetailPage({ job: row.job, company: row.company, similar, applyMessage: result.message, applyErrors: result.errors, applyValues: values }));
}));

app.get("/post-a-job", (_req, res) => {
  send(res, "Post a Job · Tranquil Peeplz", "/post-a-job", postJobPage({ industries: [...INDUSTRIES] }));
});

app.post("/post-a-job", asyncRoute(async (req, res) => {
  const values = fieldValues(req.body as Record<string, unknown>);
  if (typeof req.body.website === "string" && req.body.website.length > 0) {
    // Honeypot hit — pretend success, store nothing.
    return send(res, "Post a Job · Tranquil Peeplz", "/post-a-job",
      postJobPage({ industries: [...INDUSTRIES], success: true, message: "Thanks — your role has been received." }));
  }
  const result = await submitJobForReview(values);
  if (result.ok) {
    return send(res, "Post a Job · Tranquil Peeplz", "/post-a-job",
      postJobPage({
        industries: [...INDUSTRIES],
        success: true,
        message:
          "Thanks! Your role is with our team for approval. Check your inbox — a confirmation email is on its way. It typically goes live within one business day.",
      }));
  }
  send(res, "Post a Job · Tranquil Peeplz", "/post-a-job",
    postJobPage({ industries: [...INDUSTRIES], message: result.message, errors: result.errors, values }));
}));

// ---------------------------------- Blog ------------------------------------

app.get("/blog", asyncRoute(async (_req, res) => {
  const posts = await listBlogPosts();
  send(res, "Blog · Tranquil Peeplz", "/blog", blogPage(posts));
}));

app.get("/blog/:slug", asyncRoute(async (req, res, next) => {
  const post = await getBlogPostBySlug(String(req.params.slug));
  if (!post) return next();
  const others = (await listBlogPosts()).filter((b) => b.slug !== post.slug).slice(0, 2);
  send(res, `${post.title} · Tranquil Peeplz`, "/blog", blogPostPage(post, others), post.excerpt);
}));

// -------------------------------- Contact -----------------------------------

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(160),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  topic: z.enum(["general", "employer", "seeker", "partnership"]),
  message: z.string().trim().min(10, "Tell us a little more (10+ characters)").max(3000),
});

app.get("/contact-us", (_req, res) => {
  send(res, "Contact Us · Tranquil Peeplz", "/contact-us", contactPage());
});

app.post("/contact-us", asyncRoute(async (req, res) => {
  const values = fieldValues(req.body as Record<string, unknown>);
  if (typeof req.body.website === "string" && req.body.website.length > 0) {
    return send(res, "Contact Us · Tranquil Peeplz", "/contact-us",
      contactPage({ success: true, message: "Thanks for reaching out!" }));
  }
  const parsed = contactSchema.safeParse({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    topic: req.body.topic || "general",
    message: req.body.message,
  });
  if (!parsed.success) {
    return send(res, "Contact Us · Tranquil Peeplz", "/contact-us",
      contactPage({ message: "Please fix the highlighted fields.", errors: parsed.error.flatten().fieldErrors, values }));
  }
  await db.insert(contactMessages).values({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone || null,
    topic: parsed.data.topic,
    message: parsed.data.message,
  });
  send(res, "Contact Us · Tranquil Peeplz", "/contact-us",
    contactPage({ success: true, message: "Thanks for reaching out — our team will get back within one business day." }));
}));

// ---------------------------------- Admin -----------------------------------

app.get("/admin", asyncRoute(async (req, res) => {
  if (!isAdmin(req)) {
    return send(res, "Admin · Tranquil Peeplz", "/admin", adminLoginPage());
  }
  const [pending, open, closed, apps, emails, stats] = await Promise.all([
    listAdminJobs("pending"),
    listAdminJobs("open"),
    listAdminJobs("closed"),
    listAllApplications(),
    listEmailLogs(10),
    getAdminStats(),
  ]);
  send(res, "Admin · Tranquil Peeplz", "/admin", adminPage({ pending, open, closed, applications: apps, emails, stats }));
}));

app.post("/admin/login", (req, res) => {
  const passcode = String(req.body.passcode ?? "");
  if (passcode !== adminPasscode()) {
    return send(res, "Admin · Tranquil Peeplz", "/admin", adminLoginPage({ message: "Incorrect passcode." }));
  }
  res.cookie(ADMIN_COOKIE, adminToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: ADMIN_DAYS * 1000,
    path: "/",
  });
  res.redirect("/admin");
});

app.post("/admin/logout", (_req, res) => {
  res.clearCookie(ADMIN_COOKIE, { path: "/" });
  res.redirect("/");
});

app.post("/admin/jobs/:id/:action", asyncRoute(async (req, res) => {
  if (!isAdmin(req)) {
    res.status(401).type("html").send(page({ title: "Unauthorized", path: "/admin", body: notFoundPage() }));
    return;
  }
  const id = String(req.params.id);
  const action = String(req.params.action);
  const status = action === "approve" || action === "reopen" ? "open" : action === "close" ? "closed" : null;

  // Fetch job details before updating for email notification
  const [job] = await db
    .select({ job: jobs, companyName: companies.name })
    .from(jobs)
    .innerJoin(companies, eq(jobs.companyId, companies.id))
    .where(eq(jobs.id, id))
    .limit(1);

  if (status) {
    await db.update(jobs).set({ status: status as "open" | "closed" }).where(eq(jobs.id, id));

    // Send approval email to employer when job is approved
    if ((action === "approve" || action === "reopen") && job) {
      await sendJobApprovedEmail(
        job.job.id,
        job.job.contactEmail,
        job.job.contactName,
        job.job.title,
        job.companyName
      );
    }
  }
  res.redirect("/admin");
}));

// ------------------------------- Public API ---------------------------------

app.post("/api/jobs", asyncRoute(async (req, res) => {
  const body = (req.body ?? {}) as Record<string, unknown>;
  const { website, ...input } = body;
  if (typeof website === "string" && website.length > 0) {
    res.json({ ok: true });
    return;
  }
  const result = await submitJobForReview(input);
  res.status(result.ok ? 201 : 422).json(result);
}));

app.post("/api/applications", asyncRoute(async (req, res) => {
  const result = await submitJobApplication(req.body ?? {});
  res.status(result.ok ? 201 : 422).json(result);
}));

app.get("/api/applications.csv", asyncRoute(async (req, res) => {
  if (!isAdmin(req)) {
    res.status(401).json({ ok: false, message: "Unauthorized" });
    return;
  }
  const rows = await listAppsRaw();
  const csv = toCsv(
    ["Applied At", "Job Title", "Company", "Applicant Name", "Applicant Email", "Applicant Phone", "Resume URL", "Cover Note", "Status"],
    rows.map(({ application, job, company }) => [
      application.createdAt.toISOString(),
      job.title,
      company.name,
      application.applicantName,
      application.applicantEmail,
      application.applicantPhone ?? "",
      application.resumeUrl ?? "",
      application.coverNote ?? "",
      application.status,
    ]),
  );
  const filename = `tranquil-peeplz-applications-${new Date().toISOString().slice(0, 10)}.csv`;
  res
    .status(200)
    .set({
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    })
    .send(csv);
}));

app.get("/api/health", asyncRoute(async (_req, res) => {
  try {
    await db.execute(sql`select 1`);
    res.json({ ok: true });
  } catch {
    res.status(500).json({ ok: false });
  }
}));

app.all("/api/seed", asyncRoute(async (_req, res) => {
  try {
    await ensureDatabase();
    const result = await seedIfEmpty();
    res.json({ ok: true, ...result, message: result.seeded ? "Database seeded" : "Already seeded" });
  } catch (err) {
    res.status(500).json({ ok: false, error: err instanceof Error ? err.message : "seed failed" });
  }
}));

// Owner notifications sanity (kept for ops reads).
void OWNER_EMAIL;
void companies;
void applicationsTable;
void and;
void esc;

// --------------------------------- 404 / errors ------------------------------

app.use((_req, res) => {
  res.status(404).type("html").send(page({ title: "Page not found · Tranquil Peeplz", path: "/404", body: notFoundPage() }));
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[server error]", err);
  res
    .status(500)
    .type("html")
    .send(page({ title: "Something went wrong · Tranquil Peeplz", path: "/500", body: notFoundPage() }));
});
